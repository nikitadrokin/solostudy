import { type ToolMetadata } from "xmcp";
import { fetchAllAssignments, normalizeCanvasUrl } from "../../lib/canvas";
import { getMcpUserContext } from "../../lib/mcp-auth";

export const schema = {};

export const metadata: ToolMetadata = {
  name: "get-user-assignments",
  description: "Get all upcoming assignments for the authenticated user across all Canvas courses. Returns incomplete assignments sorted by due date.",
  annotations: {
    title: "Get My Canvas Assignments",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function getUserAssignments() {
  const ctx = await getMcpUserContext();
  
  if (!ctx) {
    throw new Error("Not authenticated. Please provide a valid API key or OAuth token.");
  }
  
  if (!ctx.canvasUrl || !ctx.canvasIntegrationToken) {
    throw new Error("Canvas credentials not configured. Please set up your Canvas integration in settings.");
  }
  
  const canvasApiUrl = `${normalizeCanvasUrl(ctx.canvasUrl)}/api/v1`;
  const assignments = await fetchAllAssignments(canvasApiUrl, ctx.canvasIntegrationToken);
  
  // Filter for incomplete assignments with due dates
  const now = new Date();
  const upcomingAssignments = assignments
    .filter((assignment) => {
      // Skip if already submitted
      if (assignment.has_submitted_submissions) return false;
      // Skip if no due date
      if (!assignment.due_at) return false;
      // Skip if already past due by more than 7 days (grace period)
      const dueDate = new Date(assignment.due_at);
      const gracePeriod = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
      if (dueDate.getTime() + gracePeriod < now.getTime()) return false;
      return true;
    })
    .sort((a, b) => {
      // Sort by due date ascending
      const dateA = new Date(a.due_at!);
      const dateB = new Date(b.due_at!);
      return dateA.getTime() - dateB.getTime();
    })
    .map((assignment) => ({
      id: assignment.id,
      name: assignment.name,
      courseId: assignment.course_id,
      dueAt: assignment.due_at,
      pointsPossible: assignment.points_possible,
      submissionTypes: assignment.submission_types,
      description: assignment.description 
        ? assignment.description.replace(/<[^>]*>/g, '').substring(0, 200) + '...'
        : null,
    }));
  
  return upcomingAssignments;
}
