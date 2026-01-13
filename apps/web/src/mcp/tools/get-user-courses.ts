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
  console.log('[MCP Tool] get-user-courses: Starting execution');
  
  try {
    const ctx = await getMcpUserContext();
    
    if (!ctx) {
      console.log('[MCP Tool] get-user-courses: ERROR - No user context found');
      return {
        content: [{ type: "text", text: "Not authenticated. Please provide a valid API key or OAuth token." }],
        isError: true,
      };
    }
    
    console.log('[MCP Tool] get-user-courses: User context retrieved', {
      userId: ctx.userId,
      hasCanvasUrl: !!ctx.canvasUrl,
      canvasUrl: ctx.canvasUrl || '(not set)',
      hasCanvasToken: !!ctx.canvasIntegrationToken,
      canvasTokenPreview: ctx.canvasIntegrationToken 
        ? `${ctx.canvasIntegrationToken.substring(0, 8)}...` 
        : '(not set)',
    });
    
    if (!ctx.canvasUrl || !ctx.canvasIntegrationToken) {
      console.log('[MCP Tool] get-user-courses: ERROR - Missing Canvas credentials', {
        userId: ctx.userId,
        missingCanvasUrl: !ctx.canvasUrl,
        missingCanvasToken: !ctx.canvasIntegrationToken,
      });
      return {
        content: [{ type: "text", text: "Canvas credentials not configured. Please set up your Canvas integration in settings." }],
        isError: true,
      };
    }
    
    const canvasApiUrl = `${normalizeCanvasUrl(ctx.canvasUrl)}/api/v1`;
    console.log('[MCP Tool] get-user-courses: Calling Canvas API', {
      userId: ctx.userId,
      canvasApiUrl,
    });
    
    const courses = await fetchCanvasCourses(canvasApiUrl, ctx.canvasIntegrationToken);
    
    console.log('[MCP Tool] get-user-courses: SUCCESS', {
      userId: ctx.userId,
      courseCount: courses.length,
    });
    
    const mappedCourses = courses.map((course) => ({
      id: String(course.id),
      name: course.name,
      courseCode: course.course_code,
      startAt: course.start_at,
      endAt: course.end_at,
    }));
    
    return {
      structuredContent: {
        status: "success",
        result: {
          courses: mappedCourses,
        },
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log('[MCP Tool] get-user-courses: ERROR from Canvas API', { error: errorMessage });
    return {
      content: [{ type: "text", text: errorMessage }],
      isError: true,
    };
  }
}
