import { xmcpHandler, withAuth, type VerifyToken } from '@xmcp/adapter';
import { validateApiKeyAndGetContext } from '../../lib/mcp-auth';

/**
 * Verify the API key and return auth information with user's Canvas credentials
 * 
 * The xmcp adapter provides:
 * - `req`: The Request object (may have headers reconstructed by adapter)
 * - `bearerToken`: Extracted from Authorization: Bearer header by the adapter
 * 
 * We support both Authorization: Bearer and x-api-key headers
 */
const verifyToken: VerifyToken = async (req: Request, bearerToken?: string) => {
  // Log all headers for debugging
  const allHeaders = Object.fromEntries(req.headers.entries());
  console.log('[MCP] Request headers:', allHeaders);
  
  // Priority: bearerToken (from Authorization header, extracted by xmcp) > x-api-key header
  const xApiKey = req.headers.get('x-api-key');
  const apiKey = bearerToken || xApiKey;
  
  console.log('[MCP] Incoming request:', {
    method: req.method,
    url: req.url,
    hasBearerToken: !!bearerToken,
    hasXApiKey: !!xApiKey,
    resolvedApiKey: apiKey ? `${apiKey.substring(0, 8)}...` : null,
  });
  
  if (!apiKey) {
    console.log('[MCP] No API key provided (checked Authorization: Bearer and x-api-key headers)');
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
