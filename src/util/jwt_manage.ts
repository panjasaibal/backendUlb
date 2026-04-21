import { config } from "@admin/config";
import { sign, verify, type SignOptions } from "jsonwebtoken";

type AuthRole = "ADMIN" | "SUPERADMIN";

interface AuthTokenPayload {
  id: string;
  username: string;
  email: string;
  role: AuthRole;
}

function getJwtSecret(): string {
  if (!config.JWT_TOKEN) {
    throw new Error("JWT_TOKEN is not configured");
  }

  return config.JWT_TOKEN;
}

function signAuthToken(
  id: string,
  username: string,
  email: string,
  role: AuthRole,
  expiresIn: SignOptions["expiresIn"],
): string {
  return sign({ id, username, email, role }, getJwtSecret(), {
    expiresIn,
  });
}

export function signAccessToken(
  id: string,
  username: string,
  email: string,
  role:AuthRole="ADMIN",
): string {
  return signAuthToken(id, username, email, role, "15m");
}

export function signCustomAccessToken(
  id: string,
  username: string,
  email: string,
  role:AuthRole="ADMIN",
  expiresIn: SignOptions["expiresIn"],
): string {
  return signAuthToken(id, username, email, role, expiresIn);
}

export function signRefreshToken(
  id: string,
  username: string,
  email: string,
  role:AuthRole="ADMIN",
): string {
  return signAuthToken(id, username, email, role, "7d");
}

export function verifyAccessToken(token: string): AuthTokenPayload {
  return verify(token, getJwtSecret()) as AuthTokenPayload;
}

export function verifyRefreshToken(token: string): AuthTokenPayload {
  return verify(token, getJwtSecret()) as AuthTokenPayload;
}

export type { AuthRole, AuthTokenPayload };

