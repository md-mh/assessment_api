import { verifyAccessToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";
export function authenticate(req, _res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        next(new AppError("Missing or invalid Authorization header", 401, "UNAUTHORIZED"));
        return;
    }
    const token = header.slice("Bearer ".length).trim();
    if (!token) {
        next(new AppError("Missing token", 401, "UNAUTHORIZED"));
        return;
    }
    try {
        const payload = verifyAccessToken(token);
        req.user = {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
        };
        next();
    }
    catch {
        next(new AppError("Invalid or expired token", 401, "UNAUTHORIZED"));
    }
}
//# sourceMappingURL=authenticate.js.map