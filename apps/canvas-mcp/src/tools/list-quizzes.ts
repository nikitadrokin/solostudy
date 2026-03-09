import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { canvasClient } from "../lib/canvas-client";

export const schema = {
  course_id: z.number().describe("The ID of the course"),
};

export const metadata: ToolMetadata = {
  name: "list-quizzes",
  description: "List all quizzes for a course",
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
};

export default async function handler({
  course_id,
}: InferSchema<typeof schema>) {
  const quizzes = await canvasClient.getQuizzes(course_id);
  return JSON.stringify(quizzes, null, 2);
}
