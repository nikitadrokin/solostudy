import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { canvasClient } from "../lib/canvas-client.js";

export const schema = {
  course_id: z.number().describe("The ID of the course"),
  search_term: z.string().describe("Search term (name or email)"),
};

export const metadata: ToolMetadata = {
  name: "search-course-users",
  description: "Search for users in a course",
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
};

export default async function handler({
  course_id,
  search_term,
}: InferSchema<typeof schema>) {
  const users = await canvasClient.searchUsers(course_id, search_term);
  return JSON.stringify(users, null, 2);
}
