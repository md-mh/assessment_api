export type UserRole = "employer" | "candidate";
export type UserRecord = {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    passwordHash: string;
    createdAt: string;
};
export type PublicUser = Omit<UserRecord, "passwordHash">;
//# sourceMappingURL=user.types.d.ts.map