import { AppError } from "../../utils/AppError.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import { signAccessToken } from "../../utils/jwt.js";
import { createUser, findUserByEmail, findUserById, toPublicUser, } from "../users/user.repository.js";
export async function registerUser(body) {
    const existing = findUserByEmail(body.email);
    if (existing) {
        throw new AppError("An account with this email already exists", 409, "CONFLICT");
    }
    const passwordHash = await hashPassword(body.password);
    const user = createUser({
        email: body.email,
        fullName: body.fullName,
        role: body.role,
        passwordHash,
    });
    const token = signAccessToken({
        sub: user.id,
        email: user.email,
        role: user.role,
    });
    return { user, token };
}
export async function loginUser(body) {
    const raw = body.email.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw);
    if (!isEmail) {
        throw new AppError("Invalid email or password", 401, "UNAUTHORIZED");
    }
    const userRecord = findUserByEmail(raw.toLowerCase());
    if (!userRecord) {
        throw new AppError("Invalid email or password", 401, "UNAUTHORIZED");
    }
    const ok = await verifyPassword(body.password, userRecord.passwordHash);
    if (!ok) {
        throw new AppError("Invalid email or password", 401, "UNAUTHORIZED");
    }
    const user = toPublicUser(userRecord);
    const token = signAccessToken({
        sub: user.id,
        email: user.email,
        role: user.role,
    });
    return { user, token };
}
export function getSessionUser(userId) {
    const record = findUserById(userId);
    if (!record) {
        throw new AppError("User not found", 404, "NOT_FOUND");
    }
    return toPublicUser(record);
}
//# sourceMappingURL=auth.service.js.map