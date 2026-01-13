import { xmcpHandler, withAuth, type VerifyToken } from '@xmcp/adapter';
import { validateApiKeyAndGetContext, getUserContext } from '../../lib/mcp-auth';
import { auth } from '../../lib/auth';

/**
 * Verify the API key and return auth information with user's Canvas credentials
 * 
 * The xmcp adapter provides:
 * - `req`: The Request object (may have headers reconstructed by adapter)
 * - `bearerToken`: Extracted from Authorization: Bearer header by the adapter
 * 
 * We support both Authorization: Bearer (OAuth/Access Token) and x-api-key headers
 */
const verifyToken: VerifyToken = async (req: Request, bearerToken?: string) => {
  // 1. Try to get session via better-auth MCP plugin (handles OAuth tokens)
  const session = await auth.api.getMcpSession({
    headers: req.headers,
  });

  if (session) {
    console.log('[MCP] Session found for user:', session.userId);
    const userContext = await getUserContext(session.userId);
    
    if (userContext) {
      return {
        token: session.accessToken,
        scopes: ['canvas:read'],
        clientId: userContext.userId,
        extra: {
          userId: userContext.userId,
          canvasUrl: userContext.canvasUrl,
          canvasIntegrationToken: userContext.canvasIntegrationToken,
        },
      };
    }
  }

  // 2. Fallback to API Key manual extraction (for non-OAuth clients)
  // Priority: bearerToken (extracted by xmcp) > x-api-key header
  const xApiKey = req.headers.get('x-api-key');
  const potentialKey = bearerToken || xApiKey;

  if (potentialKey) {
    const validKeyCtx = await validateApiKeyAndGetContext(potentialKey);
    if (validKeyCtx) {
       console.log('[MCP] API Key auth successful for user:', validKeyCtx.userId);
       return {
         token: potentialKey,
         scopes: ['canvas:read'],
         clientId: validKeyCtx.userId,
         extra: {
           userId: validKeyCtx.userId,
           canvasUrl: validKeyCtx.canvasUrl,
           canvasIntegrationToken: validKeyCtx.canvasIntegrationToken,
         },
       };
    }
  }

  console.log('[MCP] No valid auth found');
  return undefined;
};

const options = {
  verifyToken,
  required: true,
  requiredScopes: ['canvas:read'],
};

const handler = withAuth(xmcpHandler, options);

export { handler as GET, handler as POST };
