import type { XmcpConfig } from "xmcp";

const config = {
  http: true,
  paths: {
    tools: "src/tools",
    prompts: false,
    resources: false,
  },
} satisfies XmcpConfig;

export default config;
