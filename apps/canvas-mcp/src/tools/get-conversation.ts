import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { canvasClient } from "../lib/canvas-client";

export const schema = {
  conversation_id: z.number().describe("The ID of the conversation"),
};

export const metadata: ToolMetadata = {
  name: "get-conversation",
  description: "Get details about a specific conversation",
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
};

export default async function handler({
  conversation_id,
}: InferSchema<typeof schema>) {
  const conversation = await canvasClient.getConversation(conversation_id);
  return JSON.stringify(conversation, null, 2);
}
