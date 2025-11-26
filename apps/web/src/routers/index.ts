import { randomUUID } from 'node:crypto';
import { TRPCError } from '@trpc/server';
import { and, count, desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { user } from '../db/schema/auth';
import { todo } from '../db/schema/focus';
import { protectedProcedure, publicProcedure, router } from '../lib/trpc';
import { accountRouter } from './account';
import { analyticsRouter } from './analytics';
import { focusRouter } from './focus';

export const appRouter = router({
  account: accountRouter,
  analytics: analyticsRouter,
  focus: focusRouter,
  todos: {
    list: protectedProcedure.query(async ({ ctx }) => {
      try {
        const todos = await db
          .select()
          .from(todo)
          .where(eq(todo.userId, ctx.session.user.id))
          .orderBy(desc(todo.createdAt));
        return todos;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to fetch todos: ${error instanceof Error ? error.message : String(error)}`,
          cause: error,
        });
      }
    }),
    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1).max(500),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const newTodo = await db
          .insert(todo)
          .values({
            id: randomUUID(),
            userId: ctx.session.user.id,
            title: input.title.trim(),
            completed: false,
          })
          .returning();
        return newTodo[0];
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          title: z.string().min(1).max(500).optional(),
          completed: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        const updatedTodos = await db
          .update(todo)
          .set({
            ...updates,
            updatedAt: new Date(),
          })
          .where(and(eq(todo.id, id), eq(todo.userId, ctx.session.user.id)))
          .returning();
        return updatedTodos[0];
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await db
          .delete(todo)
          .where(
            and(eq(todo.id, input.id), eq(todo.userId, ctx.session.user.id))
          );
        return { success: true };
      }),
    getUncompletedCount: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.session) {
        return 0;
      }

      const result = await db
        .select({ count: count() })
        .from(todo)
        .where(
          and(eq(todo.userId, ctx.session.user.id), eq(todo.completed, false))
        );

      return result[0]?.count ?? 0;
    }),
  },
  video: {
    getLastPlayed: protectedProcedure.query(async ({ ctx }) => {
      try {
        const userData = await db
          .select({ lastPlayedVideoId: user.lastPlayedVideoId })
          .from(user)
          .where(eq(user.id, ctx.session.user.id))
          .limit(1);
        return userData[0]?.lastPlayedVideoId ?? null;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to fetch last played video: ${error instanceof Error ? error.message : String(error)}`,
          cause: error,
        });
      }
    }),
    setLastPlayed: protectedProcedure
      .input(
        z.object({
          videoId: z.string(),
        })
      )
      .mutation(async ({ ctx, input: { videoId } }) => {
        try {
          await db
            .update(user)
            .set({
              lastPlayedVideoId: videoId,
              updatedAt: new Date(),
            })
            .where(eq(user.id, ctx.session.user.id));
          return { success: true };
        } catch (error) {
          if (error instanceof TRPCError) {
            throw error;
          }
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to update last played video: ${error instanceof Error ? error.message : String(error)}`,
            cause: error,
          });
        }
      }),
  },
});
export type AppRouter = typeof appRouter;
