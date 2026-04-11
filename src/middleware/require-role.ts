import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import type { UserRole } from "../modules/users/user.types.js";

export function requireRole(...allowed: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const role = req.user?.role;
    if (!role || !allowed.includes(role)) {
      next(new AppError("Forbidden", 403, "FORBIDDEN"));
      return;
    }
    next();
  };
}
