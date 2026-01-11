import { z } from "zod";
import { type ToolMetadata, type InferSchema } from "xmcp";
import { 
  fetchCanvasCourses, 
  fetchAssignmentGroups, 
  fetchAssignmentsWithSubmissions,
  normalizeCanvasUrl,
} from "../lib/canvas";

export const schema = {
  canvasUrl: z.string().describe("Canvas LMS URL (e.g., https://school.instructure.com)"),
  accessToken: z.string().describe("Canvas API access token"),
};

export const metadata: ToolMetadata = {
  name: "get-study-plan",
  description: "Get a prioritized list of assignments based on urgency (due date) and impact (weight on grade)",
  annotations: {
    title: "Get Study Plan",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function getStudyPlan({ canvasUrl, accessToken }: InferSchema<typeof schema>) {
  const credentials = { canvasUrl, accessToken };
  const storedUrl = normalizeCanvasUrl(canvasUrl);
  
  const courses = await fetchCanvasCourses(credentials);
  const now = new Date();

  // Fetch assignments and groups for all courses
  const courseDataPromises = courses.map(async (course) => {
    try {
      const [assignments, groups] = await Promise.all([
        fetchAssignmentsWithSubmissions(credentials, course.id),
        fetchAssignmentGroups(credentials, course.id),
      ]);
      return { course, assignments, groups };
    } catch {
      return { course, assignments: [], groups: [] };
    }
  });

  const courseData = await Promise.all(courseDataPromises);

  // Build prioritized assignment list
  const prioritizedAssignments: Array<{
    id: number;
    name: string;
    courseName: string;
    courseId: number;
    dueAt: string | null;
    pointsPossible: number | null;
    groupWeight: number;
    priorityScore: number;
    urgencyScore: number;
    impactScore: number;
    daysUntilDue: number | null;
    status: 'overdue' | 'urgent' | 'upcoming' | 'later' | 'no-due-date';
    htmlUrl: string;
  }> = [];

  for (const { course, assignments, groups } of courseData) {
    // Calculate total points per group for impact calculation
    const groupTotals = new Map<number, number>();
    const groupWeights = new Map<number, number>();

    for (const group of groups) {
      groupWeights.set(group.id, group.group_weight);
      const total = assignments
        .filter((a) => a.assignment_group_id === group.id)
        .reduce((sum, a) => sum + (a.points_possible ?? 0), 0);
      groupTotals.set(group.id, total);
    }

    for (const assignment of assignments) {
      // Skip if already submitted or graded
      const isSubmitted =
        assignment.submission?.workflow_state === 'submitted' ||
        assignment.submission?.workflow_state === 'graded';
      const isGraded =
        assignment.submission?.score !== null &&
        assignment.submission?.score !== undefined;

      if (isSubmitted || isGraded) continue;

      const dueAt = assignment.due_at ? new Date(assignment.due_at) : null;
      const daysUntilDue = dueAt
        ? Math.ceil((dueAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : null;

      // Determine status
      let status: 'overdue' | 'urgent' | 'upcoming' | 'later' | 'no-due-date';
      if (daysUntilDue === null) {
        status = 'no-due-date';
      } else if (daysUntilDue < 0) {
        status = 'overdue';
      } else if (daysUntilDue <= 2) {
        status = 'urgent';
      } else if (daysUntilDue <= 7) {
        status = 'upcoming';
      } else {
        status = 'later';
      }

      // Calculate urgency score (0-100, higher = more urgent)
      let urgencyScore = 0;
      if (daysUntilDue !== null) {
        if (daysUntilDue < 0) {
          urgencyScore = 100; // Overdue gets max urgency
        } else {
          urgencyScore = Math.max(0, 100 - daysUntilDue * 10);
        }
      }

      // Calculate impact score (0-100, higher = more impact on grade)
      const groupTotal = groupTotals.get(assignment.assignment_group_id) ?? 0;
      const groupWeight = groupWeights.get(assignment.assignment_group_id) ?? 0;
      const pointsRatio =
        groupTotal > 0 ? (assignment.points_possible ?? 0) / groupTotal : 0;
      const impactScore = pointsRatio * groupWeight;

      // Combined priority score
      const priorityScore = urgencyScore * 0.6 + impactScore * 0.4;

      prioritizedAssignments.push({
        id: assignment.id,
        name: assignment.name,
        courseName: course.name,
        courseId: course.id,
        dueAt: assignment.due_at,
        pointsPossible: assignment.points_possible,
        groupWeight,
        priorityScore: Math.round(priorityScore * 10) / 10,
        urgencyScore: Math.round(urgencyScore * 10) / 10,
        impactScore: Math.round(impactScore * 10) / 10,
        daysUntilDue,
        status,
        htmlUrl: `${storedUrl}/courses/${course.id}/assignments/${assignment.id}`,
      });
    }
  }

  // Sort by priority (highest first), then by due date
  prioritizedAssignments.sort((a, b) => {
    // Overdue first
    if (a.status === 'overdue' && b.status !== 'overdue') return -1;
    if (b.status === 'overdue' && a.status !== 'overdue') return 1;
    // Then by priority score
    return b.priorityScore - a.priorityScore;
  });

  const summary = {
    totalAssignments: prioritizedAssignments.length,
    overdueCount: prioritizedAssignments.filter((a) => a.status === 'overdue').length,
    urgentCount: prioritizedAssignments.filter((a) => a.status === 'urgent').length,
    upcomingCount: prioritizedAssignments.filter((a) => a.status === 'upcoming').length,
  };

  return {
    assignments: prioritizedAssignments,
    summary,
  };
}
