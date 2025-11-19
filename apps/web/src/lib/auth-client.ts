import { apiKeyClient, passkeyClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  plugins: [
    apiKeyClient(),
    passkeyClient(),
  ],
});

export const { signIn, signOut, signUp, useSession } = authClient;

export type Passkey = {
  id: string;
  name?: string;
  deviceType: string;
  createdAt: Date;
  backedUp: boolean;
};
