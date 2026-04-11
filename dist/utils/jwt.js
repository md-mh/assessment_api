import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
const ISSUER = "ibos-assessment-api";
export function signAccessToken(payload) {
    return jwt.sign({
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
        iss: ISSUER,
    }, env.JWT_SECRET, { expiresIn: "7d" });
}
export function verifyAccessToken(token) {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (typeof decoded.sub !== "string" ||
        typeof decoded.email !== "string" ||
        (decoded.role !== "employer" && decoded.role !== "candidate")) {
        throw new Error("Invalid token payload");
    }
    return {
        sub: decoded.sub,
        email: decoded.email,
        role: decoded.role,
    };
}
//# sourceMappingURL=jwt.js.map