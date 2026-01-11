import { z } from "zod";
import { type ToolMetadata, type InferSchema } from "xmcp";
import { fetchCanvasCourses, fetchCalendarEvents } from "../lib/canvas";

export const schema = {
  canvasUrl: z.string().describe("Canvas LMS URL (e.g., https://school.instructure.com)"),
  accessToken: z.string().describe("Canvas API access token"),
  startDate: z.string().describe("Start date in ISO 8601 format (e.g., 2024-01-01)"),
  endDate: z.string().describe("End date in ISO 8601 format (e.g., 2024-01-31)"),
};

export const metadata: ToolMetadata = {
  name: "get-calendar-events",
  description: "Get calendar events for all enrolled courses within a date range",
  annotations: {
    title: "Get Canvas Calendar Events",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function getCalendarEvents({ 
  canvasUrl, 
  accessToken,
  startDate,
  endDate,
}: InferSchema<typeof schema>) {
  const credentials = { canvasUrl, accessToken };
  
  const courses = await fetchCanvasCourses(credentials);
  const contextCodes = courses.map((c) => `course_${c.id}`);
  
  const events = await fetchCalendarEvents(credentials, contextCodes, startDate, endDate);

  return events.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    startAt: event.start_at,
    endAt: event.end_at,
    allDay: event.all_day,
    contextCode: event.context_code,
    contextName: event.context_name,
    htmlUrl: event.html_url,
    type: event.type,
    assignment: event.assignment ? {
      id: event.assignment.id,
      name: event.assignment.name,
      dueAt: event.assignment.due_at,
    } : null,
  }));
}
