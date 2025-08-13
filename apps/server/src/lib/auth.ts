import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { passkey } from 'better-auth/plugins/passkey';
// import { github } from 'better-auth/social-providers';
import { db } from '../db';
import { account, session, user, verification } from '../db/schema/auth';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',

    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  trustedOrigins: [process.env.CORS_ORIGIN || ''],
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    // github({
    //   clientId: process.env.GITHUB_CLIENT_ID,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET,
    // }),
    passkey(),
  ],
});
