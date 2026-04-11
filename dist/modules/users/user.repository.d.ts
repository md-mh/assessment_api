import type { PublicUser, UserRecord, UserRole } from "./user.types.js";
export declare function findUserByEmail(email: string): UserRecord | null;
export declare function findUserById(id: string): UserRecord | null;
export declare function createUser(input: {
    email: string;
    fullName: string;
    role: UserRole;
    passwordHash: string;
}): PublicUser;
export declare function toPublicUser(record: UserRecord): PublicUser;
//# sourceMappingURL=user.repository.d.ts.map