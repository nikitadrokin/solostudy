import { z } from "zod";
import { type ToolMetadata, type InferSchema } from "xmcp";
import { fetchCourseFiles } from "../lib/canvas";

export const schema = {
  canvasUrl: z.string().describe("Canvas LMS URL (e.g., https://school.instructure.com)"),
  accessToken: z.string().describe("Canvas API access token"),
  courseId: z.number().describe("Course ID to list files for"),
};

export const metadata: ToolMetadata = {
  name: "get-course-files",
  description: "Get all files available in a specific course",
  annotations: {
    title: "Get Course Files",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function getCourseFiles({ 
  canvasUrl, 
  accessToken,
  courseId,
}: InferSchema<typeof schema>) {
  const credentials = { canvasUrl, accessToken };
  
  const files = await fetchCourseFiles(credentials, courseId);

  return files.map((file) => ({
    id: file.id,
    displayName: file.display_name,
    filename: file.filename,
    contentType: file['content-type'],
    url: file.url,
    size: file.size,
    mimeClass: file.mime_class,
    createdAt: file.created_at,
    updatedAt: file.updated_at,
    locked: file.locked,
    hidden: file.hidden,
  }));
}
