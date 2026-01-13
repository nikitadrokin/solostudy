import { xmcpHandler, withAuth, type VerifyToken } from '@xmcp/adapter';
import { validateApiKeyAndGetContext } from '../../lib/mcp-auth';

/**
 * Verify the API key and return auth information with user's Canvas credentials
 */
const verifyToken: VerifyToken = async (req: Request) => {
  const apiKey = req.headers.get('x-api-key');
  
  console.log('[MCP] Incoming request:', {
    method: req.method,
    url: req.url,
    hasApiKey: !!apiKey,
    headers: Object.fromEntries(req.headers.entries()),
  });
  
  if (!apiKey) {
    console.log('[MCP] No API key provided');
    return undefined;
  }

  try {
    const userContext = await validateApiKeyAndGetContext(apiKey);
    
    if (!userContext) {
      console.log('[MCP] Invalid API key or user not found');
      return undefined;
    }

    console.log('[MCP] Auth successful for user:', userContext.userId);
    
    return {
      token: apiKey,
      scopes: ['canvas:read'],
      clientId: userContext.userId,
      extra: {
        userId: userContext.userId,
        canvasUrl: userContext.canvasUrl,
        canvasIntegrationToken: userContext.canvasIntegrationToken,
      },
    };
  } catch (error) {
    console.error('[MCP] Auth error:', error);
    return undefined;
  }
};

const options = {
  verifyToken,
  required: true,
  requiredScopes: ['canvas:read'],
};

const handler = withAuth(xmcpHandler, options);

export { handler as GET, handler as POST };
