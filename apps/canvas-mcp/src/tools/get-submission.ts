import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { canvasClient } from "../lib/canvas-client.js";

export const schema = {
  course_id: z.number().describe("The ID of the course"),
  assignment_id: z.number().describe("The ID of the assignment"),
};

export const metadata: ToolMetadata = {
  name: "get-submission",
  description: "Get submission details for an assignment",
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
  const submission = await canvasClient.getSubmission(course_id, assignment_id);
  return JSON.stringify(submission, null, 2);
}
