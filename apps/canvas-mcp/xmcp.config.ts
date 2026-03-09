import type { XmcpConfig } from "xmcp";

const config = {
  http: {
    port: 3847,
    endpoint: "/mcp",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization", "mcp-session-id"],
      credentials: false,
    },
    debug: false,
  },
  stdio: {
    debug: false,
  },
  paths: {
    tools: "src/tools",
    prompts: false,
    resources: false,
  },
} satisfies XmcpConfig;

export default config;
