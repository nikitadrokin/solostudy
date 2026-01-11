import { z } from "zod";
import { type ToolMetadata, type InferSchema } from "xmcp";
import { fetchCanvasCourses } from "../lib/canvas";

export const schema = {
  canvasUrl: z.string().describe("Canvas LMS URL (e.g., https://school.instructure.com)"),
  accessToken: z.string().describe("Canvas API access token"),
};

export const metadata: ToolMetadata = {
  name: "get-courses",
  description: "Get all enrolled courses for the authenticated user",
  annotations: {
    title: "Get Canvas Courses",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function getCourses({ canvasUrl, accessToken }: InferSchema<typeof schema>) {
  const courses = await fetchCanvasCourses({ canvasUrl, accessToken });
  return courses.map((course) => ({
    id: course.id,
    name: course.name,
    courseCode: course.course_code,
    startAt: course.start_at,
    endAt: course.end_at,
  }));
}
