import { randomUUID } from 'node:crypto';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { user } from '../db/schema/auth';
import { todo } from '../db/schema/focus';
import {
  fetchAllAssignments,
  fetchAnnouncements,
  fetchAssignmentGroups,
  fetchAssignmentsWithSubmissions,
  fetchCalendarEvents,
  fetchCanvasCourses,
  fetchCanvasUser,
  fetchCourseAssignments,
  fetchUserEnrollment,
  normalizeCanvasUrl,
  validateCanvasToken,
} from '../lib/canvas';
import { canvasProcedure, protectedProcedure, router } from '../lib/trpc';

export const canvasRouter = router({
  /**
   * Connect Canvas account by storing access token and URL
   */
  connect: protectedProcedure
    .input(
      z.object({
        accessToken: z.string().min(1),
        canvasUrl: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Normalize and validate URL
      const normalizedUrl = normalizeCanvasUrl(input.canvasUrl);
      const apiUrl = `${normalizedUrl}/api/v1`;

      // Validate token
      const isValid = await validateCanvasToken(apiUrl, input.accessToken);

      if (!isValid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid Canvas access token',
        });
      }

      // Store token and URL
      await db
        .update(user)
        .set({
          canvasIntegrationToken: input.accessToken,
          canvasUrl: normalizedUrl,
          updatedAt: new Date(),
        })
        .where(eq(user.id, ctx.session.user.id));

      return { success: true };
    }),

  /**
   * Disconnect Canvas account
   */
  disconnect: protectedProcedure.mutation(async ({ ctx }) => {
    await db
      .update(user)
      .set({
        canvasIntegrationToken: null,
        canvasUrl: process.env.NEXT_PUBLIC_CANVAS_URL ?? '',
        updatedAt: new Date(),
      })
      .where(eq(user.id, ctx.session.user.id));

    return { success: true };
  }),

  /**
   * Get connection status
   */
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const userData = await db
      .select({
        canvasIntegrationToken: user.canvasIntegrationToken,
        canvasUrl: user.canvasUrl,
      })
      .from(user)
      .where(eq(user.id, ctx.session.user.id))
      .limit(1);

    const userRecord = userData[0];
    const token = userRecord?.canvasIntegrationToken;
    const storedUrl = userRecord?.canvasUrl;

    if (!(token && storedUrl)) {
      return { connected: false, canvasUrl: storedUrl ?? null };
    }

    // Validate token is still valid
    const apiUrl = `${storedUrl}/api/v1`;
    const isValid = await validateCanvasToken(apiUrl, token);

    return {
      connected: isValid,
      canvasUrl: storedUrl,
    };
  }),

  /**
   * Get Canvas credentials for editing (returns URL only, token is never exposed)
   */
  getCredentials: protectedProcedure.query(async ({ ctx }) => {
    const userData = await db
      .select({
        canvasUrl: user.canvasUrl,
        canvasIntegrationToken: user.canvasIntegrationToken,
      })
      .from(user)
      .where(eq(user.id, ctx.session.user.id))
      .limit(1);

    const userRecord = userData[0];
    const canvasUrl = userRecord?.canvasUrl ?? null;
    const canvasIntegrationToken = userRecord?.canvasIntegrationToken ?? null;

    return {
      canvasUrl,
      canvasIntegrationToken,
    };
  }),

  /**
   * Get courses directly from Canvas API
   */
  getCourses: canvasProcedure.query(async ({ ctx: { canvas } }) => {
    try {
      const courses = await fetchCanvasCourses(canvas.apiUrl, canvas.token);
      return courses.map((course) => ({
        id: String(course.id),
        canvasId: course.id,
        name: course.name,
        courseCode: course.course_code,
        startAt: course.start_at ? new Date(course.start_at) : null,
        endAt: course.end_at ? new Date(course.end_at) : null,
      }));
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to fetch courses: ${error instanceof Error ? error.message : String(error)}`,
        cause: error,
      });
    }
  }),

  /**
   * Get assignments directly from Canvas API
   */
  getAssignments: canvasProcedure
    .input(
      z.object({
        courseId: z.number().optional(),
        includeCompleted: z.boolean().default(false),
      })
    )
    .query(async ({ ctx: { canvas }, input }) => {
      try {
        const assignments = input.courseId
          ? await fetchCourseAssignments(
              canvas.apiUrl,
              canvas.token,
              input.courseId
            )
          : await fetchAllAssignments(canvas.apiUrl, canvas.token);

        // Sort by due date
        assignments.sort((a, b) => {
          const aDate = a.due_at ? new Date(a.due_at).getTime() : 0;
          const bDate = b.due_at ? new Date(b.due_at).getTime() : 0;
          return aDate - bDate;
        });

        if (input.includeCompleted) {
          return assignments.map((assignment) => ({
            id: String(assignment.id),
            canvasId: assignment.id,
            courseId: String(assignment.course_id),
            name: assignment.name,
            description: assignment.description,
            dueAt: assignment.due_at ? new Date(assignment.due_at) : null,
            unlockAt: assignment.unlock_at
              ? new Date(assignment.unlock_at)
              : null,
            lockAt: assignment.lock_at ? new Date(assignment.lock_at) : null,
            pointsPossible: assignment.points_possible,
            submissionTypes: assignment.submission_types,
            submitted: assignment.has_submitted_submissions ?? false,
            graded: assignment.graded_submissions_exist ?? false,
          }));
        }

        const isIncomplete = (a: (typeof assignments)[number]) => {
          const submitted = a.has_submitted_submissions ?? false;
          const graded = a.graded_submissions_exist ?? false;
          const notSubmitted = !submitted;
          const notGraded = !graded;
          return notSubmitted && notGraded;
        };

        const incomplete = assignments.filter(isIncomplete);

        return incomplete.map((assignment) => ({
          id: String(assignment.id),
          canvasId: assignment.id,
          courseId: String(assignment.course_id),
          name: assignment.name,
          description: assignment.description,
          dueAt: assignment.due_at ? new Date(assignment.due_at) : null,
          unlockAt: assignment.unlock_at
            ? new Date(assignment.unlock_at)
            : null,
          lockAt: assignment.lock_at ? new Date(assignment.lock_at) : null,
          pointsPossible: assignment.points_possible,
          submissionTypes: assignment.submission_types,
          submitted: assignment.has_submitted_submissions ?? false,
          graded: assignment.graded_submissions_exist ?? false,
        }));
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to fetch assignments: ${error instanceof Error ? error.message : String(error)}`,
          cause: error,
        });
      }
    }),

  /**
   * Import Canvas assignments as todos (fetches from Canvas API)
   */
  importAssignmentsAsTodos: canvasProcedure
    .input(
      z.object({
        assignmentIds: z.array(z.number()),
      })
    )
    .mutation(
      async ({
        ctx: {
          canvas,
          session: {
            user: { id: userId },
          },
        },
        input,
      }) => {
        try {
          const allAssignments = await fetchAllAssignments(
            canvas.apiUrl,
            canvas.token
          );
          const assignmentsToImport = allAssignments.filter((a) =>
            input.assignmentIds.includes(a.id)
          );

          const todoPromises = assignmentsToImport.map(async (assignment) => {
            // Check if todo already exists for this assignment
            const existingTodo = await db
              .select()
              .from(todo)
              .where(eq(todo.userId, userId))
              .limit(1);

            if (existingTodo.length === 0) {
              const newTodo = await db
                .insert(todo)
                .values({
                  id: randomUUID(),
                  userId,
                  title: assignment.name,
                  completed: false,
                })
                .returning();

              return newTodo[0];
            }

            return null;
          });

          const results = await Promise.all(todoPromises);
          const createdTodos = results.filter(
            (result): result is NonNullable<typeof result> => result !== null
          );

          return { success: true, todosCreated: createdTodos.length };
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to import assignments: ${error instanceof Error ? error.message : String(error)}`,
            cause: error,
          });
        }
      }
    ),

  /**
   * Get grades for all courses
   */
  getGrades: canvasProcedure.query(async ({ ctx: { canvas } }) => {
    try {
      const courses = await fetchCanvasCourses(canvas.apiUrl, canvas.token);
      const canvasUser = await fetchCanvasUser(canvas.apiUrl, canvas.token);

      const gradesPromises = courses.map(async (course) => {
        try {
          const enrollment = await fetchUserEnrollment(
            canvas.apiUrl,
            canvas.token,
            course.id,
            canvasUser.id
          );
          return {
            courseId: course.id,
            courseName: course.name,
            courseCode: course.course_code,
            currentScore: enrollment?.grades?.current_score ?? null,
            currentGrade: enrollment?.grades?.current_grade ?? null,
            finalScore: enrollment?.grades?.final_score ?? null,
            finalGrade: enrollment?.grades?.final_grade ?? null,
          };
        } catch {
          return {
            courseId: course.id,
            courseName: course.name,
            courseCode: course.course_code,
            currentScore: null,
            currentGrade: null,
            finalScore: null,
            finalGrade: null,
          };
        }
      });

      return await Promise.all(gradesPromises);
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to fetch grades: ${error instanceof Error ? error.message : String(error)}`,
        cause: error,
      });
    }
  }),

  /**
   * Get calendar events for all courses
   */
  getCalendarEvents: canvasProcedure
    .input(
      z.object({
        startDate: z.string(),
        endDate: z.string(),
      })
    )
    .query(async ({ ctx: { canvas }, input }) => {
      try {
        const courses = await fetchCanvasCourses(canvas.apiUrl, canvas.token);
        const contextCodes = courses.map((c) => `course_${c.id}`);

        const events = await fetchCalendarEvents(
          canvas.apiUrl,
          canvas.token,
          contextCodes,
          input.startDate,
          input.endDate
        );

        return events.map((event) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          startAt: event.start_at,
          endAt: event.end_at,
          allDay: event.all_day,
          contextCode: event.context_code,
          contextName: event.context_name,
          type: event.type,
          htmlUrl: event.html_url,
        }));
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to fetch calendar events: ${error instanceof Error ? error.message : String(error)}`,
          cause: error,
        });
      }
    }),

  /**
   * Get announcements for all courses
   */
  getAnnouncements: canvasProcedure.query(async ({ ctx: { canvas } }) => {
    try {
      const courses = await fetchCanvasCourses(canvas.apiUrl, canvas.token);
      const contextCodes = courses.map((c) => `course_${c.id}`);

      const announcements = await fetchAnnouncements(
        canvas.apiUrl,
        canvas.token,
        contextCodes
      );

      // Create a map of course IDs to names for display
      const courseMap = new Map(courses.map((c) => [`course_${c.id}`, c.name]));

      return announcements.map((announcement) => ({
        id: announcement.id,
        title: announcement.title,
        message: announcement.message,
        postedAt: announcement.posted_at,
        contextCode: announcement.context_code,
        courseName:
          courseMap.get(announcement.context_code) ?? 'Unknown Course',
        htmlUrl: announcement.html_url,
        userName: announcement.user_name,
      }));
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to fetch announcements: ${error instanceof Error ? error.message : String(error)}`,
        cause: error,
      });
    }
  }),

  /**
   * Get grade analysis for a course (assignment groups, weights, submissions)
   */
  getGradeAnalysis: canvasProcedure
    .input(
      z.object({
        courseId: z.number(),
      })
    )
    .query(async ({ ctx: { canvas }, input }) => {
      try {
        const [assignmentGroups, assignments] = await Promise.all([
          fetchAssignmentGroups(canvas.apiUrl, canvas.token, input.courseId),
          fetchAssignmentsWithSubmissions(
            canvas.apiUrl,
            canvas.token,
            input.courseId
          ),
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
                (a.submission?.score === null ||
                  a.submission?.score === undefined) &&
                !a.submission?.excused &&
                a.points_possible !== null &&
                a.points_possible > 0
            );

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
              assignmentCount: groupAssignments.length,
              gradedCount: gradedAssignments.length,
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
            totalWeightedScore +=
              (group.currentPercentage / 100) * group.weight;
            totalWeight += group.weight;
          }
        }

        const currentOverallGrade =
          totalWeight > 0 ? (totalWeightedScore / totalWeight) * 100 : null;

        // Calculate what's needed for target grades
        const targetGrades = [90, 80, 70, 60]; // A, B, C, D
        const remainingWeight = 100 - totalWeight;
        const projections = targetGrades.map((target) => {
          if (remainingWeight <= 0 || totalWeight === 0) {
            return {
              targetGrade: target,
              needed: null,
              achievable: currentOverallGrade !== null && currentOverallGrade >= target,
            };
          }

          // Calculate needed percentage on remaining work
          // target = (currentWeighted + neededPct * remainingWeight) / 100
          // neededPct = (target * 100 - currentWeighted * 100) / remainingWeight
          const neededPct =
            (target - (totalWeightedScore / 100) * 100) /
            (remainingWeight / 100);

          return {
            targetGrade: target,
            needed: Math.max(0, Math.min(100, neededPct)),
            achievable: neededPct >= 0 && neededPct <= 100,
          };
        });

        return {
          groups: groupAnalysis,
          currentOverallGrade,
          totalWeight,
          remainingWeight,
          projections,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to fetch grade analysis: ${error instanceof Error ? error.message : String(error)}`,
          cause: error,
        });
      }
    }),
});
