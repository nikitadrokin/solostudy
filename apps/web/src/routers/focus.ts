import { TRPCError } from '@trpc/server';
import { and, desc, eq, gte, sql, sum } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { focusRoomVideo, focusSession } from '../db/schema/focus';
import { protectedProcedure, publicProcedure, router } from '../lib/trpc';

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

      return result.map((row) => ({
        date: row.date,
        totalSeconds: Number(row.totalSeconds ?? 0),
      }));
    }),
});
