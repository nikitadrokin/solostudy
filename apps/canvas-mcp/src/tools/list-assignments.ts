import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { canvasClient } from "../lib/canvas-client";

export const schema = {
  course_id: z.number().describe("The ID of the course"),
};

export const metadata: ToolMetadata = {
  name: "list-assignments",
  description: "List all assignments for a course",
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
};

export default async function handler({
  course_id,
}: InferSchema<typeof schema>) {
  const assignments = await canvasClient.getAssignments(course_id);
  return JSON.stringify(assignments, null, 2);
}
