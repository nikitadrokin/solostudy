import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { canvasClient } from "../lib/canvas-client.js";

export const schema = {
  course_id: z.number().describe("The ID of the course"),
  quiz_id: z.number().describe("The ID of the quiz"),
};

export const metadata: ToolMetadata = {
  name: "get-quiz-submission",
  description: "Get submission details for a quiz",
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
};

export default async function handler({
  course_id,
  quiz_id,
}: InferSchema<typeof schema>) {
  const submission = await canvasClient.getQuizSubmission(course_id, quiz_id);
  return JSON.stringify(submission, null, 2);
}
