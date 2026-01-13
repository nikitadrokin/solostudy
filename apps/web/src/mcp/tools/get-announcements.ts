import { type ToolMetadata } from "xmcp";
import { fetchCanvasCourses, fetchAnnouncements, normalizeCanvasUrl } from "../../lib/canvas";
import { getMcpUserContext } from "../../lib/mcp-auth";

export const schema = {};

export const metadata: ToolMetadata = {
  name: "get-announcements",
  description: "Get recent announcements from all Canvas courses. Returns announcements sorted by date with course context.",
  annotations: {
    title: "Get Canvas Announcements",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function getAnnouncements() {
  console.log('[MCP Tool] get-announcements: Starting execution');
  
  const ctx = await getMcpUserContext();
  
  if (!ctx) {
    console.log('[MCP Tool] get-announcements: ERROR - No user context found');
    throw new Error("Not authenticated. Please provide a valid API key or OAuth token.");
  }
  
  console.log('[MCP Tool] get-announcements: User context retrieved', {
    userId: ctx.userId,
    hasCanvasUrl: !!ctx.canvasUrl,
    hasCanvasToken: !!ctx.canvasIntegrationToken,
  });
  
  if (!ctx.canvasUrl || !ctx.canvasIntegrationToken) {
    console.log('[MCP Tool] get-announcements: ERROR - Missing Canvas credentials');
    throw new Error("Canvas credentials not configured. Please set up your Canvas integration in settings.");
  }
  
  const canvasApiUrl = `${normalizeCanvasUrl(ctx.canvasUrl)}/api/v1`;
  console.log('[MCP Tool] get-announcements: Calling Canvas API', { userId: ctx.userId, canvasApiUrl });
  
  try {
    // First get courses to build context codes
    const courses = await fetchCanvasCourses(canvasApiUrl, ctx.canvasIntegrationToken);
    
    // Build context codes for all courses (format: course_123)
    const contextCodes = courses.map((course) => `course_${course.id}`);
    
    if (contextCodes.length === 0) {
      console.log('[MCP Tool] get-announcements: No courses found');
      return [];
    }
    
    // Fetch announcements
    const announcements = await fetchAnnouncements(canvasApiUrl, ctx.canvasIntegrationToken, contextCodes);
    
    // Build a course lookup map
    const courseMap = new Map(courses.map((c) => [c.id, c.name]));
    
    // Sort by posted date descending and format response
    const formattedAnnouncements = announcements
      .sort((a, b) => {
        const dateA = new Date(a.posted_at);
        const dateB = new Date(b.posted_at);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 20) // Limit to 20 most recent
      .map((announcement) => {
        // Extract course ID from context_code (format: "course_123")
        const courseId = parseInt(announcement.context_code?.replace('course_', '') || '0', 10);
        
        return {
          id: announcement.id,
          title: announcement.title,
          courseId,
          courseName: courseMap.get(courseId) || 'Unknown Course',
          postedAt: announcement.posted_at,
          author: announcement.user_name || 'Unknown',
          message: announcement.message 
            ? announcement.message.replace(/<[^>]*>/g, '').substring(0, 300) + (announcement.message.length > 300 ? '...' : '')
            : null,
          url: announcement.html_url,
        };
      });
    
    console.log('[MCP Tool] get-announcements: SUCCESS', {
      userId: ctx.userId,
      announcementCount: formattedAnnouncements.length,
    });
    
    return formattedAnnouncements;
  } catch (error) {
    console.log('[MCP Tool] get-announcements: ERROR from Canvas API', {
      userId: ctx.userId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
