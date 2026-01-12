import { type XmcpConfig } from "xmcp";

const config: XmcpConfig = {
  http: true,
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