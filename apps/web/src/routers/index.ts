import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { user } from '../db/schema/auth';
import { protectedProcedure, router } from '../lib/trpc';
import { accountRouter } from './account';
import { focusRouter } from './focus';

export const appRouter = router({
  account: accountRouter,
  focus: focusRouter,
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
