import type { UserRole } from "../modules/users/user.types.js";
export type JwtPayload = {
    sub: string;
    email: string;
    role: UserRole;
};
export declare function signAccessToken(payload: JwtPayload): string;
export declare function verifyAccessToken(token: string): JwtPayload;
//# sourceMappingURL=jwt.d.ts.map