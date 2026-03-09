import { type Middleware } from "xmcp";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const middleware: Middleware = async (req: any, res: any, next: any) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  const canvasUrl = url.searchParams.get("canvas_url");

  if (!canvasUrl) {
    res.status(400).json({ error: "Missing canvas_url query parameter" });
    return;
  }

  try {
    new URL(canvasUrl);
  } catch {
    res.status(400).json({ error: "Invalid canvas_url — must be a valid URL" });
    return;
  }

  req.headers["x-canvas-url"] = canvasUrl;

  return next();
};

export default middleware;
