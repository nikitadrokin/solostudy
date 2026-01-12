import { db } from '../db';
import { user } from '../db/schema/auth';
import { auth } from './auth';
import { eq } from 'drizzle-orm';

export type UserContext = {
  userId: string;
  canvasUrl: string | null;
  canvasIntegrationToken: string | null;
};

/**
 * Validates an API key using better-auth's verifyApiKey and returns the user context if valid
 */
export async function validateApiKeyAndGetContext(apiKey: string): Promise<UserContext | null> {
  // Use better-auth's built-in verifyApiKey - handles hashing, rate limiting, expiration
  const result = await auth.api.verifyApiKey({
    body: {
      key: apiKey,
    },
  });

  if (!result.valid || !result.key) {
    return null;
  }

  const userId = result.key.userId;

  // Fetch the user's Canvas credentials
  const userRecord = await db
    .select({
      id: user.id,
      canvasUrl: user.canvasUrl,
      canvasIntegrationToken: user.canvasIntegrationToken,
    })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (userRecord.length === 0) {
    return null;
  }

  return {
    userId: userRecord[0].id,
    canvasUrl: userRecord[0].canvasUrl,
    canvasIntegrationToken: userRecord[0].canvasIntegrationToken,
  };
}
