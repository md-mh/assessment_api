import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { apiRouter } from "./routes/index.js";
import { errorHandler } from "./middleware/error-handler.js";
export function createApp() {
    const app = express();
    /** Avoid conditional GET / 304 with stale `If-None-Match` on user-specific JSON (same URL, different role). */
    app.set("etag", false);
    app.use(helmet());
    app.use(cors({
        origin: env.CORS_ORIGIN.split(",").map((o) => o.trim()),
        credentials: true,
    }));
    app.use(express.json({ limit: "1mb" }));
    app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
    app.use("/api", (_req, res, next) => {
        res.set("Cache-Control", "private, no-store");
        next();
    });
    app.get("/health", (_req, res) => {
        res.json({ status: "ok" });
    });
    app.use("/api", apiRouter);
    app.use(errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map