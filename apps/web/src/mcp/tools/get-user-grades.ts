import { type ToolMetadata } from "xmcp";
import { fetchCanvasCourses, fetchAssignmentsWithSubmissions, normalizeCanvasUrl } from "../../lib/canvas";
import { getMcpUserContext } from "../../lib/mcp-auth";

export const schema = {};

export const metadata: ToolMetadata = {
  name: "get-user-grades",
  description: "Get grades and submission status for all assignments across all Canvas courses. Returns graded assignments with scores.",
  annotations: {
    title: "Get My Canvas Grades",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function getUserGrades() {
  console.log('[MCP Tool] get-user-grades: Starting execution');
  
  try {
    const ctx = await getMcpUserContext();
    
    if (!ctx) {
      console.log('[MCP Tool] get-user-grades: ERROR - No user context found');
      return {
        content: [{ type: "text", text: "Not authenticated. Please provide a valid API key or OAuth token." }],
        isError: true,
      };
    }
    
    console.log('[MCP Tool] get-user-grades: User context retrieved', {
      userId: ctx.userId,
      hasCanvasUrl: !!ctx.canvasUrl,
      hasCanvasToken: !!ctx.canvasIntegrationToken,
    });
    
    if (!ctx.canvasUrl || !ctx.canvasIntegrationToken) {
      console.log('[MCP Tool] get-user-grades: ERROR - Missing Canvas credentials');
      return {
        content: [{ type: "text", text: "Canvas credentials not configured. Please set up your Canvas integration in settings." }],
        isError: true,
      };
    }
    
    const canvasApiUrl = `${normalizeCanvasUrl(ctx.canvasUrl)}/api/v1`;
    console.log('[MCP Tool] get-user-grades: Calling Canvas API', { userId: ctx.userId, canvasApiUrl });
    
    const courses = await fetchCanvasCourses(canvasApiUrl, ctx.canvasIntegrationToken);
    
    // Fetch assignments with submissions for each course
    const courseGradesPromises = courses.map(async (course) => {
      try {
        const assignments = await fetchAssignmentsWithSubmissions(
          canvasApiUrl, 
          ctx.canvasIntegrationToken!, 
          course.id
        );
        
        // Filter for graded assignments only
        const gradedAssignments = assignments
          .filter((a) => a.submission && a.submission.score !== null)
          .map((a) => ({
            id: a.id,
            name: a.name,
            courseId: course.id,
            courseName: course.name,
            pointsPossible: a.points_possible,
            score: a.submission!.score,
            grade: a.submission!.grade,
            submittedAt: a.submission!.submitted_at,
            workflowState: a.submission!.workflow_state,
            late: a.submission!.late,
            missing: a.submission!.missing,
          }));
        
        return {
          courseId: course.id,
          courseName: course.name,
          assignments: gradedAssignments,
          totalAssignments: assignments.length,
          gradedAssignments: gradedAssignments.length,
        };
      } catch {
        // Skip courses that fail
        return null;
      }
    });
    
    const courseGrades = (await Promise.all(courseGradesPromises)).filter(Boolean);
    
    console.log('[MCP Tool] get-user-grades: SUCCESS', {
      userId: ctx.userId,
      coursesWithGrades: courseGrades.length,
    });
    
    return {
      structuredContent: {
        status: "success",
        result: {
          grades: courseGrades,
        },
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log('[MCP Tool] get-user-grades: ERROR from Canvas API', { error: errorMessage });
    return {
      content: [{ type: "text", text: errorMessage }],
      isError: true,
    };
  }
}
