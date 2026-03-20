import { NextFunction, Request, Response, Router } from "express";
import { passport } from "@admin/passport";
import { oauthCallback } from "@admin/controller/OAuth/superadmin.auth.controller";
import { AuthenticateOptions } from "passport";
import {
  attachOAuthStates,
  parseOAuthState,
} from "@admin/middleware/superadmin.oAuth.middleware";

const router = Router();

router.get(
  "/google/signup",
  attachOAuthStates("signup"),
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("google", {
      scope: ["profile", "email"],
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
  passport.authenticate(
    "google",
    {
      session: false,
    },
    oauthCallback,
  ),
);

export const superAdminAuthRoutes = () => router;
