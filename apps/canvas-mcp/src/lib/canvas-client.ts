import { CanvasClient } from "../canvas/client";
import { headers } from "xmcp/headers";

export function getCanvasClient(): CanvasClient {
  let baseUrl: string;
  let accessToken: string;

  try {
    // HTTP mode: read from request headers (set by middleware + MCP client)
    const h = headers();
    baseUrl = (h["x-canvas-url"] as string) || "";
    accessToken =
      (h["authorization"] as string | undefined)?.replace(
        /^Bearer\s+/i,
        ""
      ) || "";
  } catch {
    // STDIO mode: headers() throws outside HTTP request context
    baseUrl = process.env.CANVAS_BASE_URL || "";
    accessToken = process.env.CANVAS_ACCESS_TOKEN || "";
  }

  if (!baseUrl || !accessToken) {
    throw new Error(
      "Canvas base URL and access token are required. " +
        "For HTTP: pass canvas_url as a query param and the token via Authorization header. " +
        "For STDIO: set CANVAS_BASE_URL and CANVAS_ACCESS_TOKEN env vars."
    );
  }

  return new CanvasClient({ baseUrl, accessToken });
}
