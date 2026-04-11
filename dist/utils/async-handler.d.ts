import type { NextFunction, Request, RequestHandler, Response } from "express";
/**
 * Wraps async route handlers so rejected promises reach the error middleware.
 */
export declare function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler;
//# sourceMappingURL=async-handler.d.ts.map