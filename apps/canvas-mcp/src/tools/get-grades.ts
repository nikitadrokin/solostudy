import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { canvasClient } from "../lib/canvas-client";

export const schema = {
  course_id: z
    .number()
    .optional()
    .describe(
      "The ID of a specific course to get grades for. If omitted, returns grades for all enrolled courses."
    ),
};

export const metadata: ToolMetadata = {
  name: "get-grades",
  description:
    "Get grades for a specific course or all enrolled courses. Omit course_id to get all grades.",
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
};

export default async function handler({
  course_id,
}: InferSchema<typeof schema>) {
  const grades = course_id
    ? await canvasClient.getGrades(course_id)
    : await canvasClient.getAllGrades();
  return JSON.stringify(grades, null, 2);
}
