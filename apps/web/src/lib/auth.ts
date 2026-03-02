import { passkey } from '@better-auth/passkey';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, mcp } from 'better-auth/plugins';
import { apiKey } from '@better-auth/api-key';
import { dash } from "@better-auth/infra";
import { db } from '../db';
import {
  account,
  apikey as apikeyTable,
  oauthAccessToken,
  oauthApplication,
  oauthConsent,
  passkey as passkeyTable,
  session,
  user,
  verification,
} from '../db/schema/auth';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user,
      session,
      account,
      verification,
      passkey: passkeyTable,
      apikey: apikeyTable,
      oauthApplication,
      oauthAccessToken,
      oauthConsent,
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
    admin(),
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
    mcp({
      loginPage: '/sign-in',
    }),
    dash()
  ],
});
