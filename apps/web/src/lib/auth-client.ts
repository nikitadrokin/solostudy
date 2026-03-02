import { passkeyClient } from '@better-auth/passkey/client';
import { adminClient, apiKeyClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { sentinelClient } from "@better-auth/infra/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  plugins: [adminClient(), apiKeyClient(), passkeyClient(), sentinelClient()],
});

export const { signIn, signOut, signUp, useSession } = authClient;

export type Passkey = {
  id: string;
  name?: string;
  deviceType: string;
  createdAt: Date;
  backedUp: boolean;
};
