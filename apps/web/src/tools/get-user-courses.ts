import { type ToolMetadata } from "xmcp";
import { headers } from "xmcp/headers";
import { fetchCanvasCourses, normalizeCanvasUrl } from "../lib/canvas";
import { validateApiKeyAndGetContext } from "../lib/mcp-auth";

export const schema = {};

export const metadata: ToolMetadata = {
  name: "get-user-courses",
  description: "Get all enrolled courses for the authenticated user. Requires API key authentication via x-api-key header.",
  annotations: {
    title: "Get My Canvas Courses",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function getUserCourses() {
  const requestHeaders = headers();
  const apiKeyHeader = requestHeaders["x-api-key"];
  const apiKey = Array.isArray(apiKeyHeader) ? apiKeyHeader[0] : apiKeyHeader;
  
  if (!apiKey) {
    throw new Error("API key required. Please provide x-api-key header.");
  }
  
  const ctx = await validateApiKeyAndGetContext(apiKey);
  
  if (!ctx) {
    throw new Error("Invalid or expired API key.");
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
