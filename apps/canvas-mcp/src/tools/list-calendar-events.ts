import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { canvasClient } from "../lib/canvas-client";

export const schema = {
  start_date: z
    .string()
    .optional()
    .describe("Start date in ISO 8601 format (e.g., 2024-01-01)"),
  end_date: z
    .string()
    .optional()
    .describe("End date in ISO 8601 format (e.g., 2024-12-31)"),
};

export const metadata: ToolMetadata = {
  name: "list-calendar-events",
  description: "List calendar events within a date range",
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
};

export default async function handler({
  start_date,
  end_date,
}: InferSchema<typeof schema>) {
  const events = await canvasClient.getCalendarEvents(start_date, end_date);
  return JSON.stringify(events, null, 2);
}
