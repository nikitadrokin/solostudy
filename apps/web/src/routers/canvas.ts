import { randomUUID } from 'node:crypto';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { user } from '../db/schema/auth';
import { todo } from '../db/schema/focus';
import {
  fetchAllAssignments,
  fetchCanvasCourses,
  fetchCourseAssignments,
  normalizeCanvasUrl,
  validateCanvasToken,
} from '../lib/canvas';
import { protectedProcedure, router } from '../lib/trpc';

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
   * Validate Canvas connection (no data storage)
   */
  sync: protectedProcedure.mutation(async ({ ctx }) => {
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
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Canvas not connected',
      });
    }

    try {
      // Just validate connection by fetching courses
      const apiUrl = `${storedUrl}/api/v1`;
      const courses = await fetchCanvasCourses(apiUrl, token);
      const assignments = await fetchAllAssignments(apiUrl, token);

      return {
        success: true,
        coursesFound: courses.length,
        assignmentsFound: assignments.length,
      };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to validate Canvas connection: ${error instanceof Error ? error.message : String(error)}`,
        cause: error,
      });
    }
  }),

  /**
   * Get courses directly from Canvas API
   */
  getCourses: protectedProcedure.query(async ({ ctx }) => {
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
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Canvas not connected',
      });
    }

    try {
      const apiUrl = `${storedUrl}/api/v1`;
      const courses = await fetchCanvasCourses(apiUrl, token);
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
  getAssignments: protectedProcedure
    .input(
      z.object({
        courseId: z.number().optional(),
        includeCompleted: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
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
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Canvas not connected',
        });
      }

      try {
        const apiUrl = `${storedUrl}/api/v1`;
        const assignments = input.courseId
          ? await fetchCourseAssignments(apiUrl, token, input.courseId)
          : await fetchAllAssignments(apiUrl, token);

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
  importAssignmentsAsTodos: protectedProcedure
    .input(
      z.object({
        assignmentIds: z.array(z.number()),
      })
    )
    .mutation(async ({ ctx, input }) => {
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
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Canvas not connected',
        });
      }

      try {
        // Fetch all assignments to find the ones we need
        const apiUrl = `${storedUrl}/api/v1`;
        const allAssignments = await fetchAllAssignments(apiUrl, token);
        const assignmentsToImport = allAssignments.filter((a) =>
          input.assignmentIds.includes(a.id)
        );

        const todoPromises = assignmentsToImport.map(async (assignment) => {
          // Check if todo already exists for this assignment
          const existingTodo = await db
            .select()
            .from(todo)
            .where(eq(todo.userId, ctx.session.user.id))
            .limit(1);

          if (existingTodo.length === 0) {
            const newTodo = await db
              .insert(todo)
              .values({
                id: randomUUID(),
                userId: ctx.session.user.id,
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
    }),
});
