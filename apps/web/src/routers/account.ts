import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { apikey as apikeyTable } from '@/db/schema/auth';
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
});
