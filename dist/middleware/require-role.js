import { AppError } from "../utils/AppError.js";
export function requireRole(...allowed) {
    return (req, _res, next) => {
        const role = req.user?.role;
        if (!role || !allowed.includes(role)) {
            next(new AppError("Forbidden", 403, "FORBIDDEN"));
            return;
        }
        next();
    };
}
//# sourceMappingURL=require-role.js.map