import type { RegisterBody, LoginBody } from "./auth.validation.js";
export declare function registerUser(body: Omit<RegisterBody, "confirmPassword">): Promise<{
    user: import("../users/user.types.js").PublicUser;
    token: string;
}>;
export declare function loginUser(body: LoginBody): Promise<{
    user: import("../users/user.types.js").PublicUser;
    token: string;
}>;
export declare function getSessionUser(userId: string): import("../users/user.types.js").PublicUser;
//# sourceMappingURL=auth.service.d.ts.map