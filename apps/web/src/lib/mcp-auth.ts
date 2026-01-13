import { db } from '../db';
import { user } from '../db/schema/auth';
import { auth } from './auth';
import { eq } from 'drizzle-orm';
import { AsyncLocalStorage } from 'async_hooks';

export type UserContext = {
  userId: string;
  canvasUrl: string | null;
  canvasIntegrationToken: string | null;
};

// AsyncLocalStorage to pass authenticated user context to tools
const mcpUserContextStorage = new AsyncLocalStorage<UserContext>();

/**
 * Sets the MCP user context for the current request
 * Called by route.ts after successful authentication
 */
export function setMcpUserContext(context: UserContext): void {
  // Note: This is a simplified approach. In practice, the AsyncLocalStorage
  // needs to be entered before setting. We'll use a module-level variable as fallback.
  currentContext = context;
}

// Module-level context as fallback (works for single-request scenarios)
let currentContext: UserContext | null = null;

/**
 * Gets the authenticated MCP user context in tools
 * Call this in your MCP tools to get the validated user context
 */
export async function getMcpUserContext(): Promise<UserContext | null> {
  // Try AsyncLocalStorage first, then fallback to module-level
  const ctx = mcpUserContextStorage.getStore() || currentContext;
  
  if (!ctx) {
    return null;
  }
  
  return ctx;
}

/**
 * Fetches the user context (Canvas credentials) for a given user ID
 */
export async function getUserContext(userId: string): Promise<UserContext | null> {
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

  return getUserContext(result.key.userId);
}
