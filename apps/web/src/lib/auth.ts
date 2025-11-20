import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { apiKey } from 'better-auth/plugins';
import { passkey } from 'better-auth/plugins/passkey';
// import { github } from 'better-auth/social-providers';
import { db } from '../db';
import {
  account,
  apikey as apikeyTable,
  passkey as passkeyTable,
  session,
  user,
  verification,
} from '../db/schema/auth';

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user,
      session,
      account,
      verification,
      passkey: passkeyTable,
      apikey: apikeyTable,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  plugins: [
    // github({
    //   clientId: process.env.GITHUB_CLIENT_ID,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET,
    // }),
    apiKey({
      maximumNameLength: 32,
    }),
    passkey({
      rpID: process.env.PASSKEY_RP_ID || 'localhost',
      rpName: process.env.PASSKEY_RP_NAME || 'SoloStudy',
      origin: process.env.PASSKEY_ORIGIN || 'http://localhost:3000',
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
      },
    }),
  ],
});
