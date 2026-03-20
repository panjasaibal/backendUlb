import { NextFunction, Request, Response, Router } from "express";
import { passport } from "@admin/passport";
import { oauthCallback } from "@admin/controller/OAuth/admin.auth.controller";

const router = Router();

const buildState = (flow: "signup" | "signin", superadmin?: string) =>
  JSON.stringify({
    flow,
    ...(superadmin ? { superadmin } : {})
  });

// SIGN UP
router.get(
  "/google/signup",
  (req: Request, res: Response, next: NextFunction) =>
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: buildState(
        "signup",
        typeof req.query.superadmin === "string" ? req.query.superadmin : undefined
      )
    })(req, res, next)
);

// SIGN IN
router.get(
  "/google/signin",
  (req: Request, res: Response, next: NextFunction) =>
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: buildState("signin")
    })(req, res, next)
);

// CALLBACK
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  oauthCallback
);

export default router;
