import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { canvasClient } from "../lib/canvas-client";

export const schema = {
  course_id: z.number().describe("The ID of the course"),
};

export const metadata: ToolMetadata = {
  name: "get-course",
  description: "Get details about a specific course",
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
};

export default async function handler({
  course_id,
}: InferSchema<typeof schema>) {
  const course = await canvasClient.getCourse(course_id);
  return JSON.stringify(course, null, 2);
}
