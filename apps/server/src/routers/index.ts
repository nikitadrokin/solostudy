import { randomUUID } from 'node:crypto';
import { TRPCError } from '@trpc/server';
import { and, desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { todo } from '../db/schema/todos';
import { protectedProcedure, publicProcedure, router } from '../lib/trpc';

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return 'OK';
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: 'This is private',
      user: ctx.session.user,
    };
  }),
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
  },
});
export type AppRouter = typeof appRouter;
