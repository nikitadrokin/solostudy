import { type XmcpConfig } from "xmcp";

const config: XmcpConfig = {
  http: {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "x-api-key",
        "mcp-session-id",
        "mcp-protocol-version",
      ],
      exposedHeaders: ["Content-Type", "Authorization", "mcp-session-id"],
      credentials: true,
      maxAge: 86400,
    },
  },
  experimental: {
    adapter: "nextjs",
  },
  paths: {
    tools: "src/mcp/tools",
    prompts: "src/mcp/prompts",
    resources: false,
  },
  typescript: {
    skipTypeCheck: true,
  },
};

export default config;