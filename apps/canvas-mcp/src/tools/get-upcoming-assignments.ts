import { type ToolMetadata } from "xmcp";
import { getCanvasClient } from "../lib/canvas-client";

export const metadata: ToolMetadata = {
  name: "get-upcoming-assignments",
  description: "Get upcoming assignments and events",
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
};

export default async function handler() {
  const canvasClient = getCanvasClient();
  const events = await canvasClient.getUpcomingAssignments();
  return JSON.stringify(events, null, 2);
}
