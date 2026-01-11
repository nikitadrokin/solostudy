import { z } from "zod";
import { type ToolMetadata, type InferSchema } from "xmcp";
import { fetchCanvasCourses, fetchAnnouncements } from "../lib/canvas";

export const schema = {
  canvasUrl: z.string().describe("Canvas LMS URL (e.g., https://school.instructure.com)"),
  accessToken: z.string().describe("Canvas API access token"),
};

export const metadata: ToolMetadata = {
  name: "get-announcements",
  description: "Get recent announcements from all enrolled courses",
  annotations: {
    title: "Get Canvas Announcements",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function getAnnouncements({ canvasUrl, accessToken }: InferSchema<typeof schema>) {
  const credentials = { canvasUrl, accessToken };
  
  const courses = await fetchCanvasCourses(credentials);
  const contextCodes = courses.map((c) => `course_${c.id}`);
  
  const announcements = await fetchAnnouncements(credentials, contextCodes);

  // Sort by posted date, most recent first
  const sorted = announcements.sort(
    (a, b) => new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime()
  );

  return sorted.map((announcement) => ({
    id: announcement.id,
    title: announcement.title,
    message: announcement.message,
    postedAt: announcement.posted_at,
    contextCode: announcement.context_code,
    htmlUrl: announcement.html_url,
    author: announcement.user_name,
    readState: announcement.read_state,
  }));
}
