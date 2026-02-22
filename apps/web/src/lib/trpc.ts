import { initTRPC, TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import superjson from 'superjson';
import z, { ZodError } from 'zod';
import { db } from '@/db';
import { user } from '@/db/schema/auth';
import type { Context } from '../lib/context';

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? z.treeifyError(error.cause) : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
      cause: 'No session',
    });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role !== 'admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Admin access required',
    });
  }
  return next({ ctx });
});

export const canvasProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const userData = await db
    .select({
      canvasIntegrationToken: user.canvasIntegrationToken,
      canvasUrl: user.canvasUrl,
    })
    .from(user)
    .where(eq(user.id, ctx.session.user.id))
    .limit(1);

  const userRecord = userData[0];
  const token = userRecord?.canvasIntegrationToken;
  const storedUrl = userRecord?.canvasUrl;

  if (!(token && storedUrl)) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Canvas not connected',
    });
  }

  return next({
    ctx: {
      ...ctx,
      canvas: {
        token,
        storedUrl,
        apiUrl: `${storedUrl}/api/v1`,
      },
    },
  });
});
