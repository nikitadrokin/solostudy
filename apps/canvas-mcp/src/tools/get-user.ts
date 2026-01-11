import { z } from "zod";
import { type ToolMetadata, type InferSchema } from "xmcp";
import { fetchCanvasUser } from "../lib/canvas";

export const schema = {
  canvasUrl: z.string().describe("Canvas LMS URL (e.g., https://school.instructure.com)"),
  accessToken: z.string().describe("Canvas API access token"),
};

export const metadata: ToolMetadata = {
  name: "get-user",
  description: "Get the authenticated Canvas user's profile information",
  annotations: {
    title: "Get Canvas User",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function getUser({ canvasUrl, accessToken }: InferSchema<typeof schema>) {
  const user = await fetchCanvasUser({ canvasUrl, accessToken });
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}
