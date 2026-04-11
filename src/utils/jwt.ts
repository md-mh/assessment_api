import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { UserRole } from "../modules/users/user.types.js";

export type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

const ISSUER = "ibos-assessment-api";

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(
    {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      iss: ISSUER,
    },
    env.JWT_SECRET,
    { expiresIn: "7d" },
  );
}

export function verifyAccessToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload & {
    email?: string;
    role?: UserRole;
  };
  if (
    typeof decoded.sub !== "string" ||
    typeof decoded.email !== "string" ||
    (decoded.role !== "employer" && decoded.role !== "candidate")
  ) {
    throw new Error("Invalid token payload");
  }
  return {
    sub: decoded.sub,
    email: decoded.email,
    role: decoded.role,
  };
}
