import 'server-only';

import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { headers } from 'next/headers';
import { cache } from 'react';

import { createCallerFactory } from '@/lib/trpc';
import { type AppRouter, appRouter } from '@/routers';
import { auth } from '../lib/auth';
import { createQueryClient } from './query-client';

const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set('x-trpc-source', 'rsc');

  const session = await auth.api.getSession({
    headers: heads,
  });

  return {
    session,
    headers: heads,
  };
});

const getQueryClient = cache(createQueryClient);
const createCaller = createCallerFactory(appRouter);
const caller = createCaller(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient
);
