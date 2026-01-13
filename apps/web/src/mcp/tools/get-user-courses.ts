import { type ToolMetadata } from "xmcp";
import { fetchCanvasCourses, normalizeCanvasUrl } from "../../lib/canvas";
import { getMcpUserContext } from "../../lib/mcp-auth";

export const schema = {};

export const metadata: ToolMetadata = {
  name: "get-user-courses",
  description: "Get all enrolled courses for the authenticated user.",
  annotations: {
    title: "Get My Canvas Courses",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function getUserCourses() {
  const ctx = await getMcpUserContext();
  
  if (!ctx) {
    throw new Error("Not authenticated. Please provide a valid API key or OAuth token.");
  }
  
  if (!ctx.canvasUrl || !ctx.canvasIntegrationToken) {
    throw new Error("Canvas credentials not configured. Please set up your Canvas integration in settings.");
  }
  
  const canvasApiUrl = `${normalizeCanvasUrl(ctx.canvasUrl)}/api/v1`;
  const courses = await fetchCanvasCourses(canvasApiUrl, ctx.canvasIntegrationToken);
  
  return courses.map((course) => ({
    id: course.id,
    name: course.name,
    courseCode: course.course_code,
    startAt: course.start_at,
    endAt: course.end_at,
  }));
}
