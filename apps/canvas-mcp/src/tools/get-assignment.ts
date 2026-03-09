import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { canvasClient } from "../lib/canvas-client";

export const schema = {
  course_id: z.number().describe("The ID of the course"),
  assignment_id: z.number().describe("The ID of the assignment"),
};

export const metadata: ToolMetadata = {
  name: "get-assignment",
  description: "Get details about a specific assignment",
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
};

export default async function handler({
  course_id,
  assignment_id,
}: InferSchema<typeof schema>) {
  const assignment = await canvasClient.getAssignment(course_id, assignment_id);
  return JSON.stringify(assignment, null, 2);
}
