import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, router } from '../lib/trpc';

type PostHogEvent = {
  event: string;
  properties: Record<string, unknown>;
  timestamp: string;
};

async function fetchPostHogEvents(
  apiKey: string,
  projectId: string,
  host: string,
  distinctId: string,
  event: string,
  limit = 100
): Promise<PostHogEvent[]> {
  const url = new URL(`${host}/api/projects/${projectId}/events/`);
  url.searchParams.set('distinct_id', distinctId);
  if (event) {
    url.searchParams.set('event', event);
  }
  url.searchParams.set('limit', String(limit));

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: `PostHog API error: ${response.statusText} - ${errorText}`,
    });
  }

  const data = (await response.json()) as { results: PostHogEvent[] };
  return data.results ?? [];
}

export const analyticsRouter = router({
  getEventCounts: protectedProcedure
    .input(
      z.object({
        days: z.number().min(1).max(90).default(7),
      })
    )
    .query(async ({ ctx, input }) => {
      const apiKey = process.env.POSTHOG_API_KEY;
      const projectId = process.env.POSTHOG_PROJECT_ID;
      const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

      if (!apiKey) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'PostHog API key not configured',
        });
      }
      if (!projectId) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'PostHog project ID not configured',
        });
      }
      if (!host) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'PostHog host not configured',
        });
      }

      const userEmail = ctx.session.user.email;
      if (!userEmail) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'User email not found',
        });
      }

      try {
        const events = await fetchPostHogEvents(
          apiKey,
          projectId,
          host,
          userEmail,
          '',
          1000
        );

        const eventCounts: Record<string, number> = {};
        const dailyCounts: Record<string, Record<string, number>> = {};

        for (const event of events) {
          const eventDate = new Date(event.timestamp)
            .toISOString()
            .split('T')[0];

          if (!dailyCounts[eventDate]) {
            dailyCounts[eventDate] = {};
          }

          dailyCounts[eventDate][event.event] =
            (dailyCounts[eventDate][event.event] ?? 0) + 1;
          eventCounts[event.event] = (eventCounts[event.event] ?? 0) + 1;
        }

        const chartData = Array.from({ length: input.days }, (_, i) => {
          const date = new Date(
            Date.now() - (input.days - 1 - i) * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0];

          const dayData = dailyCounts[date];
          const focusKey = 'focus_session_completed';
          const focusValue =
            dayData && focusKey in dayData ? dayData[focusKey] : 0;
          return {
            date,
            tasks: dayData?.task_created ?? 0,
            completed: dayData?.task_completed ?? 0,
            focus: typeof focusValue === 'number' ? focusValue : 0,
          };
        });

        return {
          totalEvents: events.length,
          eventCounts,
          chartData,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to fetch analytics: ${error instanceof Error ? error.message : String(error)}`,
          cause: error,
        });
      }
    }),

  getTaskAnalytics: protectedProcedure
    .input(
      z.object({
        days: z.number().min(1).max(90).default(7),
      })
    )
    .query(async ({ ctx, input }) => {
      const apiKey = process.env.POSTHOG_API_KEY;
      const projectId = process.env.POSTHOG_PROJECT_ID;
      const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

      if (!apiKey) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'PostHog API key not configured',
        });
      }
      if (!projectId) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'PostHog project ID not configured',
        });
      }
      if (!host) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'PostHog host not configured',
        });
      }

      const userEmail = ctx.session.user.email;
      if (!userEmail) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'User email not found',
        });
      }

      try {
        const events = await fetchPostHogEvents(
          apiKey,
          projectId,
          host,
          userEmail,
          '',
          1000
        );

        const taskEvents = events.filter(
          (e) =>
            e.event === 'task_created' ||
            e.event === 'task_completed' ||
            e.event === 'task_deleted'
        );

        const chartData = Array.from({ length: input.days }, (_, i) => {
          const date = new Date(
            Date.now() - (input.days - 1 - i) * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0];

          const dayEvents = taskEvents.filter(
            (e) => new Date(e.timestamp).toISOString().split('T')[0] === date
          );

          return {
            date,
            created: dayEvents.filter((e) => e.event === 'task_created').length,
            completed: dayEvents.filter((e) => e.event === 'task_completed')
              .length,
            deleted: dayEvents.filter((e) => e.event === 'task_deleted').length,
          };
        });

        return {
          totalTasks: taskEvents.filter((e) => e.event === 'task_created')
            .length,
          completedTasks: taskEvents.filter((e) => e.event === 'task_completed')
            .length,
          deletedTasks: taskEvents.filter((e) => e.event === 'task_deleted')
            .length,
          chartData,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to fetch task analytics: ${error instanceof Error ? error.message : String(error)}`,
          cause: error,
        });
      }
    }),

  getFocusAnalytics: protectedProcedure
    .input(
      z.object({
        days: z.number().min(1).max(90).default(7),
      })
    )
    .query(async ({ ctx, input }) => {
      const apiKey = process.env.POSTHOG_API_KEY;
      const projectId = process.env.POSTHOG_PROJECT_ID;
      const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

      if (!apiKey) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'PostHog API key not configured',
        });
      }
      if (!projectId) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'PostHog project ID not configured',
        });
      }
      if (!host) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'PostHog host not configured',
        });
      }

      const userEmail = ctx.session.user.email;
      if (!userEmail) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'User email not found',
        });
      }

      try {
        const events = await fetchPostHogEvents(
          apiKey,
          projectId,
          host,
          userEmail,
          '',
          1000
        );

        const focusEvents = events.filter(
          (e) =>
            e.event === 'focus_timer_started' ||
            e.event === 'focus_session_completed'
        );

        const chartData = Array.from({ length: input.days }, (_, i) => {
          const date = new Date(
            Date.now() - (input.days - 1 - i) * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0];

          const dayEvents = focusEvents.filter(
            (e) => new Date(e.timestamp).toISOString().split('T')[0] === date
          );

          const completedEvents = dayEvents.filter(
            (e) => e.event === 'focus_session_completed'
          );

          const totalFocusTime = completedEvents.reduce((sum, e) => {
            const timeSeconds =
              typeof e.properties.focus_time_seconds === 'number'
                ? e.properties.focus_time_seconds
                : 0;
            return sum + timeSeconds;
          }, 0);

          return {
            date,
            sessions: completedEvents.length,
            totalMinutes: Math.round(totalFocusTime / 60),
          };
        });

        const totalFocusTime = focusEvents
          .filter((e) => e.event === 'focus_session_completed')
          .reduce((sum, e) => {
            const timeSeconds =
              typeof e.properties.focus_time_seconds === 'number'
                ? e.properties.focus_time_seconds
                : 0;
            return sum + timeSeconds;
          }, 0);

        return {
          totalSessions: focusEvents.filter(
            (e) => e.event === 'focus_session_completed'
          ).length,
          totalMinutes: Math.round(totalFocusTime / 60),
          chartData,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to fetch focus analytics: ${error instanceof Error ? error.message : String(error)}`,
          cause: error,
        });
      }
    }),
});
