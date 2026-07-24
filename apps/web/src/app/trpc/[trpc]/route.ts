import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { appRouter } from '@/routers';

async function createContext(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  return {
    session,
    headers: req.headers,
  };
}

function handler(req: NextRequest) {
  return fetchRequestHandler({
    endpoint: '/trpc',
    req,
    router: appRouter,
    createContext: () => createContext(req),
  });
}
export { handler as GET, handler as POST };
