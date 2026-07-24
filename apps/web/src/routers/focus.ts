import { TRPCError } from '@trpc/server';
import { asc, count, desc, eq, like, or, sql } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { focusRoomTag, focusRoomVideo } from '../db/schema/focus';
import { slugifyFocusRoomTagLabel } from '../lib/focus-room-tag';
import { adminProcedure, publicProcedure, router } from '../lib/trpc';

async function assertFocusTagSlug(slug: string): Promise<void> {
  const row = await db
    .select({ slug: focusRoomTag.slug })
    .from(focusRoomTag)
    .where(eq(focusRoomTag.slug, slug))
    .limit(1);
  if (row.length === 0) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Unknown focus room tag',
    });
  }
}

async function nextFocusTagSortOrder(): Promise<number> {
  const [row] = await db
    .select({ max: sql<number>`coalesce(max(${focusRoomTag.sortOrder}), -1)` })
    .from(focusRoomTag);
  return Number(row?.max ?? -1) + 1;
}

async function uniqueFocusTagSlug(base: string): Promise<string> {
  const rows = await db
    .select({ slug: focusRoomTag.slug })
    .from(focusRoomTag)
    .where(
      or(eq(focusRoomTag.slug, base), like(focusRoomTag.slug, `${base}-%`))
    );
  const taken = new Set(rows.map((r) => r.slug));
  if (!taken.has(base)) {
    return base;
  }
  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) {
    suffix += 1;
  }
  return `${base}-${suffix}`;
}

export const focusRouter = router({
  listFocusTags: publicProcedure.query(async () => {
    const rows = await db
      .select()
      .from(focusRoomTag)
      .orderBy(asc(focusRoomTag.sortOrder), asc(focusRoomTag.label));
    return rows.map((r) => ({
      slug: r.slug,
      label: r.label,
      sortOrder: r.sortOrder,
    }));
  }),

  createFocusTag: adminProcedure
    .input(
      z.object({
        label: z.string().min(1).max(80),
      })
    )
    .mutation(async ({ input }) => {
      const base = slugifyFocusRoomTagLabel(input.label);
      const slug = await uniqueFocusTagSlug(base);
      const sortOrder = await nextFocusTagSortOrder();
      const now = new Date();
      await db.insert(focusRoomTag).values({
        slug,
        label: input.label.trim(),
        sortOrder,
        createdAt: now,
        updatedAt: now,
      });
      return { slug, label: input.label.trim(), sortOrder };
    }),

  updateFocusTag: adminProcedure
    .input(
      z.object({
        slug: z.string().min(1),
        label: z.string().min(1).max(80),
      })
    )
    .mutation(async ({ input }) => {
      const existing = await db
        .select({ slug: focusRoomTag.slug })
        .from(focusRoomTag)
        .where(eq(focusRoomTag.slug, input.slug))
        .limit(1);
      if (existing.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Focus room tag not found',
        });
      }
      await db
        .update(focusRoomTag)
        .set({ label: input.label.trim(), updatedAt: new Date() })
        .where(eq(focusRoomTag.slug, input.slug));
      return { slug: input.slug, label: input.label.trim() };
    }),

  deleteFocusTag: adminProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const usage = await db
        .select({ n: count() })
        .from(focusRoomVideo)
        .where(eq(focusRoomVideo.tag, input.slug));
      const usedBy = Number(usage[0]?.n ?? 0);
      if (usedBy > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: `Cannot delete tag: ${usedBy} video(s) still use it`,
        });
      }
      const deleted = await db
        .delete(focusRoomTag)
        .where(eq(focusRoomTag.slug, input.slug))
        .returning({ slug: focusRoomTag.slug });
      if (deleted.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Focus room tag not found',
        });
      }
      return { slug: input.slug };
    }),

  listVideos: publicProcedure.query(async () => {
    try {
      const videos = await db
        .select()
        .from(focusRoomVideo)
        .orderBy(desc(focusRoomVideo.createdAt));

      return videos.map((video) => ({
        id: video.id,
        title: video.title,
        tag: video.tag,
      }));
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to fetch videos: ${error instanceof Error ? error.message : String(error)}`,
        cause: error,
      });
    }
  }),

  addVideo: adminProcedure
    .input(
      z.object({
        videoId: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      // Check if video already exists
      const existing = await db
        .select({ id: focusRoomVideo.id })
        .from(focusRoomVideo)
        .where(eq(focusRoomVideo.id, input.videoId))
        .limit(1);

      if (existing.length > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Video already exists in Focus Room',
        });
      }

      // Fetch video title from noembed
      let title = input.videoId;
      try {
        const res = await fetch(
          `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${input.videoId}`
        );
        if (res.ok) {
          const data = (await res.json()) as { title?: string };
          if (data.title) {
            title = data.title;
          }
        }
      } catch {
        // Fall back to using videoId as title
      }

      const [defaultTag] = await db
        .select({ slug: focusRoomTag.slug })
        .from(focusRoomTag)
        .orderBy(asc(focusRoomTag.sortOrder), asc(focusRoomTag.slug))
        .limit(1);
      const defaultSlug = defaultTag?.slug ?? 'lofi';

      await db.insert(focusRoomVideo).values({
        id: input.videoId,
        title,
        tag: defaultSlug,
      });

      return { id: input.videoId, title, tag: defaultSlug };
    }),

  listVideosAdmin: adminProcedure.query(async () => {
    try {
      const videos = await db
        .select()
        .from(focusRoomVideo)
        .orderBy(desc(focusRoomVideo.createdAt));

      return videos.map((video) => ({
        id: video.id,
        title: video.title,
        tag: video.tag,
        createdAt: video.createdAt,
        updatedAt: video.updatedAt,
        thumbnailUrl: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
      }));
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to fetch focus room videos: ${error instanceof Error ? error.message : String(error)}`,
        cause: error,
      });
    }
  }),

  updateVideo: adminProcedure
    .input(
      z
        .object({
          id: z.string().min(1),
          title: z.string().min(1).optional(),
          tag: z.string().min(1).optional(),
        })
        .refine((data) => data.title !== undefined || data.tag !== undefined, {
          message: 'Provide at least one of title or tag to update',
        })
    )
    .mutation(async ({ input }) => {
      const { id, title, tag } = input;

      if (tag !== undefined) {
        await assertFocusTagSlug(tag);
      }

      const existing = await db
        .select({ id: focusRoomVideo.id })
        .from(focusRoomVideo)
        .where(eq(focusRoomVideo.id, id))
        .limit(1);

      if (existing.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Focus room video not found',
        });
      }

      await db
        .update(focusRoomVideo)
        .set({
          ...(title !== undefined ? { title } : {}),
          ...(tag !== undefined ? { tag } : {}),
          updatedAt: new Date(),
        })
        .where(eq(focusRoomVideo.id, id));

      const [row] = await db
        .select()
        .from(focusRoomVideo)
        .where(eq(focusRoomVideo.id, id))
        .limit(1);

      if (!row) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to load updated focus room video',
        });
      }

      return {
        id: row.id,
        title: row.title,
        tag: row.tag,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        thumbnailUrl: `https://i.ytimg.com/vi/${row.id}/hqdefault.jpg`,
      };
    }),

  deleteVideo: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const deleted = await db
        .delete(focusRoomVideo)
        .where(eq(focusRoomVideo.id, input.id))
        .returning({ id: focusRoomVideo.id });

      if (deleted.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Focus room video not found',
        });
      }

      return { id: input.id };
    }),
});
