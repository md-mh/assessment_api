import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../modules/users/user.types.js";
export declare function requireRole(...allowed: UserRole[]): (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=require-role.d.ts.map