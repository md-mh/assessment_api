import { createApp } from "../src/app.js";
import "../src/db/index.js";
import type { IncomingMessage, ServerResponse } from "node:http";

const app = createApp();

export default function handler(req: IncomingMessage, res: ServerResponse) {
  const originalUrl = typeof req.url === "string" ? req.url : "";
  if (!originalUrl.startsWith("/api")) {
    req.url = "/api" + originalUrl;
  }

  return new Promise<void>((resolve, reject) => {
    app(req as any, res as any);
    res.on("finish", resolve);
    res.on("error", reject);
  });
}
