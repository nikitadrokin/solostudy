import { z } from "zod";
import { type ToolMetadata, type InferSchema } from "xmcp";
import { fetchAssignmentGroups, fetchAssignmentsWithSubmissions, normalizeCanvasUrl } from "../lib/canvas";

export const schema = {
  canvasUrl: z.string().describe("Canvas LMS URL (e.g., https://school.instructure.com)"),
  accessToken: z.string().describe("Canvas API access token"),
  courseId: z.number().describe("Course ID to analyze grades for"),
};

export const metadata: ToolMetadata = {
  name: "get-grade-analysis",
  description: "Get detailed grade analysis for a course including weighted breakdown by assignment group and grade projections",
  annotations: {
    title: "Get Grade Analysis",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function getGradeAnalysis({ 
  canvasUrl, 
  accessToken,
  courseId,
}: InferSchema<typeof schema>) {
  const credentials = { canvasUrl, accessToken };
  
  const [assignmentGroups, assignments] = await Promise.all([
    fetchAssignmentGroups(credentials, courseId),
    fetchAssignmentsWithSubmissions(credentials, courseId),
  ]);

  // Calculate grade breakdown per assignment group
  const groupAnalysis = assignmentGroups
    .sort((a, b) => a.position - b.position)
    .map((group) => {
      const groupAssignments = assignments.filter(
        (a) => a.assignment_group_id === group.id
      );

      // Separate graded vs ungraded assignments
      const gradedAssignments = groupAssignments.filter(
        (a) =>
          a.submission?.score !== null &&
          a.submission?.score !== undefined &&
          !a.submission?.excused
      );

      const ungradedAssignments = groupAssignments.filter(
        (a) =>
          a.submission?.score === null ||
          a.submission?.score === undefined ||
          a.submission?.excused
      );

      // Calculate earned and possible points
      const earnedPoints = gradedAssignments.reduce(
        (sum, a) => sum + (a.submission?.score ?? 0),
        0
      );

      const possiblePoints = gradedAssignments.reduce(
        (sum, a) => sum + (a.points_possible ?? 0),
        0
      );

      const ungradedPoints = ungradedAssignments.reduce(
        (sum, a) => sum + (a.points_possible ?? 0),
        0
      );

      const currentPercentage =
        possiblePoints > 0 ? (earnedPoints / possiblePoints) * 100 : null;

      return {
        id: group.id,
        name: group.name,
        weight: group.group_weight,
        earnedPoints,
        possiblePoints,
        ungradedPoints,
        currentPercentage,
        assignments: groupAssignments.map((a) => ({
          id: a.id,
          name: a.name,
          pointsPossible: a.points_possible,
          score: a.submission?.score ?? null,
          graded:
            a.submission?.score !== null &&
            a.submission?.score !== undefined,
          excused: a.submission?.excused ?? false,
          dueAt: a.due_at,
        })),
      };
    });

  // Calculate overall weighted grade
  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const group of groupAnalysis) {
    if (
      group.currentPercentage !== null &&
      group.weight > 0 &&
      group.possiblePoints > 0
    ) {
      totalWeightedScore += group.currentPercentage * group.weight;
      totalWeight += group.weight;
    }
  }

  const currentOverallGrade =
    totalWeight > 0 ? (totalWeightedScore / totalWeight) : null;

  // Calculate what's needed for target grades
  const targetGrades = [90, 80, 70, 60]; // A, B, C, D
  const remainingWeight = 100 - totalWeight;

  const projections = targetGrades.map((target) => {
    if (remainingWeight <= 0 || totalWeight === 0) {
      return {
        targetGrade: target,
        needed: null,
        achievable:
          currentOverallGrade !== null && currentOverallGrade >= target,
      };
    }

    const neededPct =
      (target * 100 - totalWeightedScore) / remainingWeight;
    return {
      targetGrade: target,
      needed: Math.round(neededPct * 10) / 10,
      achievable: neededPct >= 0 && neededPct <= 100,
    };
  });

  return {
    groups: groupAnalysis,
    currentOverallGrade: currentOverallGrade !== null ? Math.round(currentOverallGrade * 100) / 100 : null,
    totalWeight,
    remainingWeight,
    projections,
  };
}
