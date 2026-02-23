import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { canvasClient } from "../lib/canvas-client.js";

export const schema = {
  file_id: z.number().describe("The ID of the file"),
};

export const metadata: ToolMetadata = {
  name: "get-file",
  description: "Get information about a specific file",
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
};

export default async function handler({
  file_id,
}: InferSchema<typeof schema>) {
  const file = await canvasClient.downloadFile(file_id);
  return JSON.stringify(file, null, 2);
}
