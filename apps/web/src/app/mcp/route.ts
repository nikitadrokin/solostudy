import { xmcpHandler, withAuth, type VerifyToken } from '@xmcp/adapter';
import { validateApiKeyAndGetContext, getUserContext, setMcpUserContext } from '../../lib/mcp-auth';
import { auth } from '../../lib/auth';

/**
 * Verify the token and return auth information with user's Canvas credentials
 * 
 * Supports:
 * - OAuth tokens via better-auth MCP plugin (getMcpSession)
 * - API keys via Authorization: Bearer header
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
      // Store context for tools to access
      setMcpUserContext(userContext);
      
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

  // 2. API Key via Authorization: Bearer header only
  if (bearerToken) {
    const validKeyCtx = await validateApiKeyAndGetContext(bearerToken);
    if (validKeyCtx) {
      console.log('[MCP] API Key auth successful for user:', validKeyCtx.userId);
      
      // Store context for tools to access
      setMcpUserContext(validKeyCtx);
      
      return {
        token: bearerToken,
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
