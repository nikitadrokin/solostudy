import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { apikey as apikeyTable, user } from '@/db/schema/auth';
import { protectedProcedure, router } from '@/lib/trpc';

export const accountRouter = router({
  getApiKeyById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
      const result = await db
        .select()
        .from(apikeyTable)
        .where(
          and(
            eq(apikeyTable.id, id),
            eq(apikeyTable.userId, ctx.session.user.id)
          )
        )
        .limit(1);

      if (result.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'API key not found',
        });
      }

      return result[0];
    }),

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: increment streaks
  getStreak: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userData = await db
        .select({
          streak: user.streak,
          lastLoginAt: user.lastLoginAt,
        })
        .from(user)
        .where(eq(user.id, ctx.session.user.id))
        .limit(1);

      if (!userData[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      const { streak: currentStreak, lastLoginAt } = userData[0];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let newStreak = currentStreak ?? 0;
      let shouldUpdate = false;

      if (lastLoginAt) {
        const lastLogin = new Date(lastLoginAt);
        lastLogin.setHours(0, 0, 0, 0);

        if (lastLogin.getTime() === yesterday.getTime()) {
          // Last login was yesterday - increment streak
          newStreak = (currentStreak ?? 0) + 1;
          shouldUpdate = true;
        } else if (lastLogin.getTime() < yesterday.getTime()) {
          // Last login was more than 1 day ago - reset streak to 1
          newStreak = 1;
          shouldUpdate = true;
        } else if (lastLogin.getTime() !== today.getTime()) {
          // Last login was today but not updated yet - update timestamp only
          shouldUpdate = true;
        }
      } else {
        // First login - start streak at 1
        newStreak = 1;
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        await db
          .update(user)
          .set({
            streak: newStreak,
            lastLoginAt: today,
          })
          .where(eq(user.id, ctx.session.user.id));
      }

      return { streak: newStreak };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to get streak: ${error instanceof Error ? error.message : String(error)}`,
        cause: error,
      });
    }
  }),
});
