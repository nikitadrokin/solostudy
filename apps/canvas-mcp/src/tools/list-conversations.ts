import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { canvasClient } from "../lib/canvas-client";

export const schema = {
  scope: z
    .enum(["inbox", "unread", "starred", "sent", "archived"])
    .default("inbox")
    .describe(
      "Filter conversations by scope (inbox, unread, starred, sent, archived)"
    ),
};

export const metadata: ToolMetadata = {
  name: "list-conversations",
  description: "List all conversations (messages) in the user's inbox",
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
};

export default async function handler({
  scope,
}: InferSchema<typeof schema>) {
  const conversations = await canvasClient.getConversations(scope);
  return JSON.stringify(conversations, null, 2);
}
