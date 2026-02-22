import { TRPCError } from '@trpc/server';
import { and, desc, eq, gte, sql, sum } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { focusRoomVideo, focusSession } from '../db/schema/focus';
import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from '../lib/trpc';

export const focusRouter = router({
  listVideos: publicProcedure.query(async () => {
    try {
      const videos = await db
        .select()
        .from(focusRoomVideo)
        .orderBy(desc(focusRoomVideo.createdAt));

      return videos.map((video) => ({
        id: video.id,
        title: video.title,
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

      await db.insert(focusRoomVideo).values({
        id: input.videoId,
        title,
      });

      return { id: input.videoId, title };
    }),

  saveFocusSession: protectedProcedure
    .input(
      z.object({
        durationSeconds: z.number().int().positive(),
        startedAt: z.date(),
        endedAt: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = crypto.randomUUID();

      await db.insert(focusSession).values({
        id,
        userId: ctx.session.user.id,
        durationSeconds: input.durationSeconds,
        startedAt: input.startedAt,
        endedAt: input.endedAt,
      });

      return { id };
    }),

  getTodayFocusTime: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await db
      .select({
        totalSeconds: sum(focusSession.durationSeconds),
      })
      .from(focusSession)
      .where(
        and(
          eq(focusSession.userId, ctx.session.user.id),
          gte(focusSession.startedAt, today)
        )
      );

    return {
      totalSeconds: Number(result[0]?.totalSeconds ?? 0),
    };
  }),

  getDailyFocusStats: protectedProcedure
    .input(
      z.object({
        days: z.number().int().positive().default(7),
      })
    )
    .query(async ({ ctx, input }) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);
      startDate.setHours(0, 0, 0, 0);

      const result = await db
        .select({
          date: sql<string>`DATE(${focusSession.startedAt})`.as('date'),
          totalSeconds: sum(focusSession.durationSeconds),
          sessionCount: sql<number>`COUNT(*)`.as('session_count'),
        })
        .from(focusSession)
        .where(
          and(
            eq(focusSession.userId, ctx.session.user.id),
            gte(focusSession.startedAt, startDate)
          )
        )
        .groupBy(sql`DATE(${focusSession.startedAt})`)
        .orderBy(sql`DATE(${focusSession.startedAt})`);

      // Create a map of existing data
      const dataMap = new Map(
        result.map((row) => [
          row.date,
          {
            totalSeconds: Number(row.totalSeconds ?? 0),
            sessions: Number(row.sessionCount ?? 0),
          },
        ])
      );

      // Generate array for all days in range
      const chartData = Array.from({ length: input.days }, (_, i) => {
        const date = new Date(
          Date.now() - (input.days - 1 - i) * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split('T')[0];

        const dayData = dataMap.get(date);
        return {
          date,
          sessions: dayData?.sessions ?? 0,
          totalMinutes: Math.round((dayData?.totalSeconds ?? 0) / 60),
        };
      });

      return { chartData };
    }),
});
