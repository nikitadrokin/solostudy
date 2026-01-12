import { xmcpHandler, withAuth, type VerifyToken } from '@xmcp/adapter';
import { validateApiKeyAndGetContext } from '../../lib/mcp-auth';

/**
 * Verify the API key and return auth information with user's Canvas credentials
 */
const verifyToken: VerifyToken = async (req: Request) => {
  const apiKey = req.headers.get('x-api-key');
  
  if (!apiKey) {
    return undefined;
  }

  const userContext = await validateApiKeyAndGetContext(apiKey);
  
  if (!userContext) {
    return undefined;
  }

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
};

const options = {
  verifyToken,
  required: true,
  requiredScopes: ['canvas:read'],
};

const handler = withAuth(xmcpHandler, options);

export { handler as GET, handler as POST };
