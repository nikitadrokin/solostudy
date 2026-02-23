import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { canvasClient } from "../lib/canvas-client.js";

export const schema = {
  enrollment_state: z
    .string()
    .default("active")
    .describe("Filter by enrollment state (active, completed, etc.)"),
};

export const metadata: ToolMetadata = {
  name: "list-courses",
  description: "List all courses for the current user",
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
};

export default async function handler({
  enrollment_state,
}: InferSchema<typeof schema>) {
  const courses = await canvasClient.getCourses(enrollment_state);
  return JSON.stringify(courses, null, 2);
}
