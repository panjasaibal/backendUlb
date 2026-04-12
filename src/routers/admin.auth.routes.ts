import { NextFunction, Request, Response, Router } from "express";
import { passport } from "@admin/passport";
import { oauthCallback } from "@admin/controller/OAuth/admin.auth.controller";
import { attachOAuthStates, parseOAuthState } from "@admin/middleware/admin.OAuth.middleware";
import { AuthenticateOptions } from "passport";
import { getAllSupervisor, getAllWorker, getSupervisor, getWorker } from "@admin/controller/admin/get";
import { fetchUser } from "@admin/middleware/user.middleware";

type AdminOAuthRequest = Request & {
  oAuthState?: string | Record<string, unknown>;
};

type GoogleAuthenticateOptions = AuthenticateOptions & {
  callbackURL?: string;
};

const AUTH_BASE_PATH = "/api/v1/ulbAdmin";
const ADMIN_GOOGLE_CALLBACK_URL = "/auth/admin/google/callback";
const ADMIN_GOOGLE_CALLBACK_ROUTE = `${AUTH_BASE_PATH}${ADMIN_GOOGLE_CALLBACK_URL}`;

const router = Router();

router.get(
  "/auth/admin/google/signup",
  attachOAuthStates("signup"),
  (req: AdminOAuthRequest, res: Response, next: NextFunction) => {
    passport.authenticate("google", {
      scope: ["profile", "email"],
      callbackURL: ADMIN_GOOGLE_CALLBACK_ROUTE,
      state: typeof req.oAuthState === "string" ? req.oAuthState : undefined,
    } as AuthenticateOptions)(req, res, next);
  },
);

router.get(
  "/auth/admin/google/signin",
  attachOAuthStates("signin"),
  (req: AdminOAuthRequest, res: Response, next: NextFunction) => {
    passport.authenticate("google", {
      scope: ["profile", "email"],
      callbackURL: ADMIN_GOOGLE_CALLBACK_ROUTE,
      state: typeof req.oAuthState === "string" ? req.oAuthState : undefined,
    } as AuthenticateOptions)(req, res, next);
  },
);

router.get(
  "/auth/admin/google/callback",
  parseOAuthState,
  passport.authenticate("google",{
    session: false,
    callbackURL: ADMIN_GOOGLE_CALLBACK_ROUTE
  } as GoogleAuthenticateOptions),
  oauthCallback
);

//protected routes

router.get("/admin/getAllWorker",fetchUser, getAllWorker);
router.get("/admin/getWorker", fetchUser, getWorker);

router.get("/admin/getAllSupervisor",fetchUser, getAllSupervisor);
router.get("/admin/getSupervisor/:id", fetchUser, getSupervisor);


export const adminAuthRoutes = () => router;
