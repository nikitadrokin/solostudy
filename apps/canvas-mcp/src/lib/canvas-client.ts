import { CanvasClient } from "../canvas/client.js";

const CANVAS_BASE_URL = process.env.CANVAS_BASE_URL || "";
const CANVAS_ACCESS_TOKEN = process.env.CANVAS_ACCESS_TOKEN || "";

if (!CANVAS_BASE_URL || !CANVAS_ACCESS_TOKEN) {
  console.error(
    "Error: CANVAS_BASE_URL and CANVAS_ACCESS_TOKEN environment variables are required"
  );
  process.exit(1);
}

export const canvasClient = new CanvasClient({
  baseUrl: CANVAS_BASE_URL,
  accessToken: CANVAS_ACCESS_TOKEN,
});
