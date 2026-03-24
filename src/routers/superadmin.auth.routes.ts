import { NextFunction, Request, Response, Router } from "express";
import { passport } from "@admin/passport";
import { oauthCallback } from "@admin/controller/OAuth/superadmin.auth.controller";
import { AuthenticateOptions } from "passport";
import {
  attachOAuthStates,
  parseOAuthState,
} from "@admin/middleware/superadmin.oAuth.middleware";

type SuperAdminOAuthRequest = Request & {
  superadmin_oAuthState?: string | Record<string, unknown>;
};

type GoogleAuthenticateOptions = AuthenticateOptions & {
  callbackURL?: string;
};

const SUPERADMIN_GOOGLE_CALLBACK_URL = "/auth/superadmin/google/callback";

const router = Router();

router.get(
  "/google/signup",
  attachOAuthStates("signup"),
  (req: SuperAdminOAuthRequest, res: Response, next: NextFunction) => {
    passport.authenticate("google", {
      scope: ["profile", "email"],
      callbackURL: SUPERADMIN_GOOGLE_CALLBACK_URL,
      state:
        typeof req.superadmin_oAuthState === "string"
          ? req.superadmin_oAuthState
          : undefined,
    } as AuthenticateOptions)(req, res, next);
  },
);

router.get(
  "/google/callback",
  parseOAuthState,
  passport.authenticate("google", {
    session: false,
    callbackURL: SUPERADMIN_GOOGLE_CALLBACK_URL,
  } as GoogleAuthenticateOptions),
  oauthCallback,
);

export const superAdminAuthRoutes = () => router;
