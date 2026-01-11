import { z } from "zod";
import { type ToolMetadata, type InferSchema } from "xmcp";
import { fetchCourseAssignments, fetchAllAssignments } from "../lib/canvas";

export const schema = {
  canvasUrl: z.string().describe("Canvas LMS URL (e.g., https://school.instructure.com)"),
  accessToken: z.string().describe("Canvas API access token"),
  courseId: z.number().optional().describe("Optional course ID to filter assignments"),
  includeCompleted: z.boolean().optional().describe("Include completed/graded assignments (default: false)"),
};

export const metadata: ToolMetadata = {
  name: "get-assignments",
  description: "Get assignments for a specific course or all courses. By default only shows incomplete assignments.",
  annotations: {
    title: "Get Canvas Assignments",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function getAssignments({ 
  canvasUrl, 
  accessToken, 
  courseId,
  includeCompleted = false,
}: InferSchema<typeof schema>) {
  const credentials = { canvasUrl, accessToken };
  
  const assignments = courseId
    ? await fetchCourseAssignments(credentials, courseId)
    : await fetchAllAssignments(credentials);

  // Filter to incomplete assignments unless includeCompleted is true
  const filteredAssignments = includeCompleted
    ? assignments
    : assignments.filter((a) => {
        const isSubmitted = a.has_submitted_submissions ?? false;
        const isGraded = a.graded_submissions_exist ?? false;
        return !isSubmitted && !isGraded;
      });

  return filteredAssignments.map((assignment) => ({
    id: assignment.id,
    name: assignment.name,
    description: assignment.description,
    dueAt: assignment.due_at,
    pointsPossible: assignment.points_possible,
    courseId: assignment.course_id,
    submissionTypes: assignment.submission_types,
    submitted: assignment.has_submitted_submissions ?? false,
    graded: assignment.graded_submissions_exist ?? false,
  }));
}
