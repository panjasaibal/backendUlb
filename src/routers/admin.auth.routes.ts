import { NextFunction, Request, Response, Router } from "express";
import { passport } from "@admin/passport";
import { oauthCallback } from "@admin/controller/OAuth/admin.auth.controller";
import { attachOAuthStates, parseOAuthState } from "@admin/middleware/admin.OAuth.middleware";
import { AuthenticateOptions } from "passport";
import { getAllWorker, getWorker } from "@admin/controller/admin/get";
import { fetchUser } from "@admin/middleware/user.middleware";

type AdminOAuthRequest = Request & {
  oAuthState?: string | Record<string, unknown>;
};

type GoogleAuthenticateOptions = AuthenticateOptions & {
  callbackURL?: string;
};

const ADMIN_GOOGLE_CALLBACK_URL = "/auth/admin/google/callback";

const router = Router();

router.get(
  "/google/signup",
  attachOAuthStates("signup"),
  (req: AdminOAuthRequest, res: Response, next: NextFunction) => {
    passport.authenticate("google", {
      scope: ["profile", "email"],
      callbackURL: ADMIN_GOOGLE_CALLBACK_URL,
      state: typeof req.oAuthState === "string" ? req.oAuthState : undefined,
    } as AuthenticateOptions)(req, res, next);
  },
);

router.get(
  "/google/signin",
  attachOAuthStates("signin"),
  (req: AdminOAuthRequest, res: Response, next: NextFunction) => {
    passport.authenticate("google", {
      scope: ["profile", "email"],
      callbackURL: ADMIN_GOOGLE_CALLBACK_URL,
      state: typeof req.oAuthState === "string" ? req.oAuthState : undefined,
    } as AuthenticateOptions)(req, res, next);
  },
);

router.get(
  "/google/callback",
  parseOAuthState,
  passport.authenticate("google",{
    session: false,
    callbackURL: ADMIN_GOOGLE_CALLBACK_URL
  } as GoogleAuthenticateOptions),
  oauthCallback
);

//protected routes

router.get("/admin/getAllWorker",fetchUser, getAllWorker);
router.get("/admin/getWorker", fetchUser, getWorker);



export const adminAuthRoutes = () => router;
