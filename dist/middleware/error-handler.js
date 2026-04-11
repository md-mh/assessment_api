import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";
export function errorHandler(err, _req, res, _next) {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: err.message,
            code: err.code,
        });
        return;
    }
    console.error(err);
    const message = env.NODE_ENV === "production"
        ? "Internal server error"
        : err instanceof Error
            ? err.message
            : "Unknown error";
    res.status(500).json({ error: message, code: "INTERNAL" });
}
//# sourceMappingURL=error-handler.js.map