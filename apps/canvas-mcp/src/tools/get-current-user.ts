import { type ToolMetadata } from "xmcp";
import { canvasClient } from "../lib/canvas-client.js";

export const metadata: ToolMetadata = {
  name: "get-current-user",
  description: "Get information about the currently authenticated user",
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
};

export default async function handler() {
  const user = await canvasClient.getCurrentUser();
  return JSON.stringify(user, null, 2);
}
