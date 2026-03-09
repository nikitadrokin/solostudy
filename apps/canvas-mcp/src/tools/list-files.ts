import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { canvasClient } from "../lib/canvas-client";

export const schema = {
  course_id: z
    .number()
    .optional()
    .describe("Optional course ID to filter files"),
};

export const metadata: ToolMetadata = {
  name: "list-files",
  description: "List files (optionally filtered by course)",
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
};

export default async function handler({
  course_id,
}: InferSchema<typeof schema>) {
  const files = await canvasClient.getFiles(course_id);
  return JSON.stringify(files, null, 2);
}
