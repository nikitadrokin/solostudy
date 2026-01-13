import { type ToolMetadata } from "xmcp";
import { fetchCanvasCourses, fetchCalendarEvents, normalizeCanvasUrl } from "../../lib/canvas";
import { getMcpUserContext } from "../../lib/mcp-auth";

export const schema = {};

export const metadata: ToolMetadata = {
  name: "get-calendar-events",
  description: "Get upcoming calendar events from all Canvas courses for the next 30 days. Returns events sorted by start date.",
  annotations: {
    title: "Get Canvas Calendar Events",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function getCalendarEvents() {
  console.log('[MCP Tool] get-calendar-events: Starting execution');
  
  const ctx = await getMcpUserContext();
  
  if (!ctx) {
    console.log('[MCP Tool] get-calendar-events: ERROR - No user context found');
    throw new Error("Not authenticated. Please provide a valid API key or OAuth token.");
  }
  
  console.log('[MCP Tool] get-calendar-events: User context retrieved', {
    userId: ctx.userId,
    hasCanvasUrl: !!ctx.canvasUrl,
    hasCanvasToken: !!ctx.canvasIntegrationToken,
  });
  
  if (!ctx.canvasUrl || !ctx.canvasIntegrationToken) {
    console.log('[MCP Tool] get-calendar-events: ERROR - Missing Canvas credentials');
    throw new Error("Canvas credentials not configured. Please set up your Canvas integration in settings.");
  }
  
  const canvasApiUrl = `${normalizeCanvasUrl(ctx.canvasUrl)}/api/v1`;
  console.log('[MCP Tool] get-calendar-events: Calling Canvas API', { userId: ctx.userId, canvasApiUrl });
  
  try {
    // First get courses to build context codes
    const courses = await fetchCanvasCourses(canvasApiUrl, ctx.canvasIntegrationToken);
    
    // Build context codes for all courses (format: course_123)
    const contextCodes = courses.map((course) => `course_${course.id}`);
    
    if (contextCodes.length === 0) {
      console.log('[MCP Tool] get-calendar-events: No courses found');
      return [];
    }
    
    // Calculate date range (today to 30 days from now)
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    
    const startDate = today.toISOString().split('T')[0];
    const endDate = futureDate.toISOString().split('T')[0];
    
    // Fetch calendar events
    const events = await fetchCalendarEvents(
      canvasApiUrl, 
      ctx.canvasIntegrationToken, 
      contextCodes, 
      startDate, 
      endDate
    );
    
    // Build a course lookup map
    const courseMap = new Map(courses.map((c) => [c.id, c.name]));
    
    // Sort by start date ascending and format response
    const formattedEvents = events
      .filter((event) => event.start_at) // Only include events with start dates
      .sort((a, b) => {
        const dateA = new Date(a.start_at!);
        const dateB = new Date(b.start_at!);
        return dateA.getTime() - dateB.getTime();
      })
      .map((event) => {
        // Extract course ID from context_code (format: "course_123")
        const courseId = parseInt(event.context_code?.replace('course_', '') || '0', 10);
        
        return {
          id: event.id,
          title: event.title,
          courseId,
          courseName: courseMap.get(courseId) || 'Unknown Course',
          contextName: event.context_name,
          startAt: event.start_at,
          endAt: event.end_at,
          allDay: event.all_day,
          type: event.type,
          description: event.description 
            ? event.description.replace(/<[^>]*>/g, '').substring(0, 200) + (event.description.length > 200 ? '...' : '')
            : null,
          url: event.html_url,
        };
      });
    
    console.log('[MCP Tool] get-calendar-events: SUCCESS', {
      userId: ctx.userId,
      eventCount: formattedEvents.length,
    });
    
    return formattedEvents;
  } catch (error) {
    console.log('[MCP Tool] get-calendar-events: ERROR from Canvas API', {
      userId: ctx.userId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
