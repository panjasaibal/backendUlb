import bcrypt from "bcrypt";
import { prisma } from "@admin/prisma";
import type { SignOptions } from "jsonwebtoken";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
} from "@panjasaibal/backend_ulb_shared";
import type {
  SignInSuperAdminDto,
  SignUpSuperAdminDto,
} from "@admin/dto/superadmin-auth.dto";
import {
  signAccessToken,
  signCustomAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@admin/util/jwt_manage";

export type SuperAdminRole = "SUPERADMIN";

export interface SuperAdminProfile {
  id: string;
  username: string;
  email: string;
  role: SuperAdminRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface SuperAdminAuthResult {
  user: SuperAdminProfile;
  accessToken: string;
  refreshToken: string;
}

interface RefreshSessionInput {
  refreshToken?: string | null;
  accessTokenExpiresIn?: SignOptions["expiresIn"];
}

function toSuperAdminProfile(record: {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}): SuperAdminProfile {
  return {
    id: record.id,
    username: record.username,
    email: record.email,
    role: "SUPERADMIN",
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

function buildAuthResult(
  user: SuperAdminProfile,
  accessTokenExpiresIn: SignOptions["expiresIn"] = "15m",
): SuperAdminAuthResult {
  return {
    user,
    accessToken:
      accessTokenExpiresIn === "15m"
        ? signAccessToken(user.id, user.username, user.email, user.role)
        : signCustomAccessToken(
            user.id,
            user.username,
            user.email,
            user.role,
            accessTokenExpiresIn,
          ),
    refreshToken: signRefreshToken(
      user.id,
      user.username,
      user.email,
      user.role,
    ),
  };
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeUsername(username: string): string {
  return username.trim();
}

export async function signUpSuperAdmin(
  payload: SignUpSuperAdminDto,
): Promise<SuperAdminAuthResult> {
  const email = normalizeEmail(payload.email);
  const username = normalizeUsername(payload.username);

  const existingSuperAdmin = await prisma.superAdmin.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingSuperAdmin) {
    throw new BadRequestError(
      "Superadmin already exists with this email",
      "superadmin service signUpSuperAdmin() method",
    );
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const createdSuperAdmin = await prisma.superAdmin.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return buildAuthResult(toSuperAdminProfile(createdSuperAdmin));
}

export async function signInSuperAdmin(
  payload: SignInSuperAdminDto,
): Promise<SuperAdminAuthResult> {
  const email = normalizeEmail(payload.email);

  const superAdmin = await prisma.superAdmin.findUnique({
    where: { email },
    select: {
      id: true,
      username: true,
      email: true,
      password: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!superAdmin) {
    throw new NotAuthorizedError(
      "Invalid superadmin credentials",
      "superadmin service signInSuperAdmin() method",
    );
  }

  const isPasswordValid = await bcrypt.compare(
    payload.password,
    superAdmin.password,
  );

  if (!isPasswordValid) {
    throw new NotAuthorizedError(
      "Invalid superadmin credentials",
      "superadmin service signInSuperAdmin() method",
    );
  }

  return buildAuthResult(toSuperAdminProfile(superAdmin));
}

export async function findSuperAdminById(id: string): Promise<SuperAdminProfile> {
  const superAdmin = await prisma.superAdmin.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!superAdmin) {
    throw new NotFoundError(
      "superadmin does not exists!",
      "superadmin service findSuperAdminById() method",
    );
  }

  return toSuperAdminProfile(superAdmin);
}

export async function findSuperAdminByEmail(
  email: string,
): Promise<SuperAdminProfile | null> {
  const superAdmin = await prisma.superAdmin.findUnique({
    where: { email: normalizeEmail(email) },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return superAdmin ? toSuperAdminProfile(superAdmin) : null;
}

export async function restoreSuperAdminSession(
  input: RefreshSessionInput,
): Promise<SuperAdminAuthResult> {
  const refreshToken = input.refreshToken?.trim();

  if (!refreshToken) {
    throw new NotAuthorizedError(
      "Refresh token is required",
      "superadmin service restoreSuperAdminSession() method",
    );
  }

  const decoded = verifyRefreshToken(refreshToken);
  if (decoded.role !== "SUPERADMIN") {
    throw new NotAuthorizedError(
      "Invalid refresh token role",
      "superadmin service restoreSuperAdminSession() method",
    );
  }

  const superAdmin = await findSuperAdminById(decoded.id);
  return buildAuthResult(superAdmin, input.accessTokenExpiresIn ?? "15m");
}
