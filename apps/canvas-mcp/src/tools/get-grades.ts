import { z } from "zod";
import { type ToolMetadata, type InferSchema } from "xmcp";
import { fetchCanvasCourses, fetchCanvasUser, fetchUserEnrollment } from "../lib/canvas";

export const schema = {
  canvasUrl: z.string().describe("Canvas LMS URL (e.g., https://school.instructure.com)"),
  accessToken: z.string().describe("Canvas API access token"),
};

export const metadata: ToolMetadata = {
  name: "get-grades",
  description: "Get current grades for all enrolled courses",
  annotations: {
    title: "Get Canvas Grades",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function getGrades({ canvasUrl, accessToken }: InferSchema<typeof schema>) {
  const credentials = { canvasUrl, accessToken };
  
  const [courses, user] = await Promise.all([
    fetchCanvasCourses(credentials),
    fetchCanvasUser(credentials),
  ]);

  const gradesPromises = courses.map(async (course) => {
    try {
      const enrollment = await fetchUserEnrollment(credentials, course.id, user.id);
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
}
