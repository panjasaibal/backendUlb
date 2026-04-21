import { setAccessTokenCookie } from "@admin/cookie";
import { findAdminById } from "@admin/services/admin.oauth.services";
import {
  findSuperAdminById,
  restoreSuperAdminSession,
} from "@admin/services/superAdmin.service";
import {  SessionTimeoutError } from "@panjasaibal/backend_ulb_shared";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { TokenExpiredError, type SignOptions } from "jsonwebtoken";
import {
  signCustomAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@admin/util/jwt_manage";

interface UserDecoded {
  id: string;
  username: string;
  email: string;
  role: "ADMIN" | "SUPERADMIN";
}

const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const ADMIN_REVOKED_ERROR = "ADMIN_REVOKED";
const ACCESS_TOKEN_MISSING_ERROR = "ACCESS_TOKEN_MISSING";
const UNAUTHORIZED_ERROR = "UNAUTHORIZED";

function setAuthenticatedUser(
  req: Request,
  id: string,
  role: "ADMIN" | "SUPERADMIN",
) {
  req.user = {
    id,
    _id: id,
    role,
  };
}

function getCookieToken(req: Request, cookieName: "accessToken" | "refreshToken") {
  return req.cookies[cookieName] as string | undefined;
}

async function attachSuperAdmin(req: Request, id: string) {
  const superadmin = await findSuperAdminById(id);
  setAuthenticatedUser(req, superadmin.id, "SUPERADMIN");

  return superadmin;
}

async function attachAdmin(req: Request, id: string) {
  const admin = await findAdminById(id);
  if (String(admin.status) === "REVOKED") {
    throw new Error(ADMIN_REVOKED_ERROR);
  }

  if (!admin._id) {
    throw new Error(UNAUTHORIZED_ERROR);
  }

  setAuthenticatedUser(req, admin._id, "ADMIN");

  return admin;
}

async function attachUserByRole(
  req: Request,
  decoded: Pick<UserDecoded, "id" | "role">,
) {
  if (decoded.role === "SUPERADMIN") {
    return attachSuperAdmin(req, decoded.id);
  }

  return attachAdmin(req, decoded.id);
}

async function issueAccessTokenFromRefresh(
  req: Request,
  res: Response,
  accessTokenExpiresIn: SignOptions["expiresIn"],
  accessTokenMaxAge: number,
) {
  const refreshToken = getCookieToken(req, "refreshToken");
  if (!refreshToken) {
    throw new Error(UNAUTHORIZED_ERROR);
  }

  const refreshDecoded = verifyRefreshToken(refreshToken) as UserDecoded;

  if (refreshDecoded.role === "SUPERADMIN") {
    const restoredSession = await restoreSuperAdminSession({
      refreshToken,
      accessTokenExpiresIn,
    });

    setAuthenticatedUser(req, restoredSession.user.id, "SUPERADMIN");
    setAccessTokenCookie(res, restoredSession.accessToken, accessTokenMaxAge);
    return;
  }

  const admin = await attachAdmin(req, refreshDecoded.id);
  const adminId = admin._id;
  if (!adminId) {
    throw new Error(UNAUTHORIZED_ERROR);
  }

  const newAccessToken = signCustomAccessToken(
    adminId,
    admin.name,
    admin.email,
    admin.role!,
    accessTokenExpiresIn,
  );
  setAccessTokenCookie(res, newAccessToken, accessTokenMaxAge);
}

async function authenticateFromAccessToken(req: Request) {
  const accessToken = getCookieToken(req, "accessToken");
  if (!accessToken) {
    throw new Error(ACCESS_TOKEN_MISSING_ERROR);
  }

  const decoded = verifyAccessToken(accessToken) as UserDecoded;
  await attachUserByRole(req, decoded);
}

function shouldRefreshFromToken(error: unknown): boolean {
  return (
    error instanceof TokenExpiredError ||
    (error instanceof Error && error.message === ACCESS_TOKEN_MISSING_ERROR)
  );
}

async function authenticateWithRefreshFallback(
  req: Request,
  res: Response,
  accessTokenExpiresIn: SignOptions["expiresIn"],
  accessTokenMaxAge: number,
) {
  const accessToken = getCookieToken(req, "accessToken");

  if (!accessToken) {
    await issueAccessTokenFromRefresh(
      req,
      res,
      accessTokenExpiresIn,
      accessTokenMaxAge,
    );
    return;
  }

  try {
    await authenticateFromAccessToken(req);
  } catch (error) {
    if (!shouldRefreshFromToken(error)) {
      throw error;
    }

    await issueAccessTokenFromRefresh(
      req,
      res,
      accessTokenExpiresIn,
      accessTokenMaxAge,
    );
  }
}

function handleAuthFailure(
  error: unknown,
  res: Response,
  next: NextFunction,
  source: string,
) {
  if (error instanceof Error && error.message === ADMIN_REVOKED_ERROR) {
    return res.status(403).json({ message: "Admin access has been revoked" });
  }

  if (error instanceof TokenExpiredError) {
    return next(
      new SessionTimeoutError(
        "session timed out",
        source,
        "token_expire_error",
      ),
    );
  }

  return res.status(401).json({ message: "Unauthorized" });
}

export const authenticateUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await authenticateWithRefreshFallback(
      req,
      res,
      "15m",
      FIFTEEN_MINUTES_IN_MS,
    );
    return next();
  } catch (error) {
    if (!(error instanceof Error) && !shouldRefreshFromToken(error)) {
      return next(error);
    }

    return handleAuthFailure(
      error,
      res,
      next,
      "auth middleware authenticateUser() method",
    );
  }
};

export const autoLoginUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await issueAccessTokenFromRefresh(req, res, "1d", ONE_DAY_IN_MS);
    return next();
  } catch (error) {
    return handleAuthFailure(
      error,
      res,
      next,
      "auth middleware autoLoginUser() method",
    );
  }
};

export const requireSuperAdmin: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== "SUPERADMIN") {
    return res
      .status(403)
      .json({ message: "Only superadmins can access this resource" });
  }

  return next();
};
