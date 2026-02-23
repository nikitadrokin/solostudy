import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { canvasClient } from "../lib/canvas-client";

export const schema = {
  course_id: z
    .number()
    .optional()
    .describe(
      "The ID of a specific course to get todos for. If omitted, returns todos across all courses."
    ),
};

export const metadata: ToolMetadata = {
  name: "list-todos",
  description:
    "List todo items for a specific course or across all courses. Omit course_id to get all todos.",
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
};

export default async function handler({
  course_id,
}: InferSchema<typeof schema>) {
  const todos = course_id
    ? await canvasClient.getCourseTodos(course_id)
    : await canvasClient.getAllTodos();
  return JSON.stringify(todos, null, 2);
}
