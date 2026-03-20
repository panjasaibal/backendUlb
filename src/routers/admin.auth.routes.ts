import { NextFunction, Request, Response, Router } from "express";
import { passport } from "@admin/passport";
import { oauthCallback } from "@admin/controller/OAuth/admin.auth.controller";
import { attachOAuthStates, parseOAuthState } from "@admin/middleware/admin.OAuth.middleware";
import { AuthenticateOptions } from "passport";

const router = Router();
// const DEFAULT_CALLBACK_PATH = "/auth/admin/google/callback";
// const allowedCallbacks = new Set(
//   (config.GOOGLE_ALLOWED_CALLBACK_URLS || "")
//     .split(",")
//     .map((url) => url.trim())
//     .filter(Boolean)
// );

// const getCallbackUrl = (req: Request): string => {
//   const callbackUrl =
//     typeof req.query.callbackUrl === "string" ? req.query.callbackUrl.trim() : "";

//   if (!callbackUrl || callbackUrl === DEFAULT_CALLBACK_PATH) {
//     return DEFAULT_CALLBACK_PATH;
//   }

//   return allowedCallbacks.has(callbackUrl) ? callbackUrl : DEFAULT_CALLBACK_PATH;
// };

// const getCallbackUrlFromState = (state: unknown): string => {
//   if (typeof state !== "string") {
//     return DEFAULT_CALLBACK_PATH;
//   }

//   try {
//     const parsed = JSON.parse(state) as { callbackUrl?: string };
//     return parsed.callbackUrl && allowedCallbacks.has(parsed.callbackUrl)
//       ? parsed.callbackUrl
//       : DEFAULT_CALLBACK_PATH;
//   } catch {
//     return DEFAULT_CALLBACK_PATH;
//   }
// };

// const buildState = (
//   flow: "signup" | "signin",
//   superadmin?: string,
//   callbackUrl?: string
// ) =>
//   JSON.stringify({
//     flow,
//     ...(superadmin ? { superadmin } : {}),
//     ...(callbackUrl ? { callbackUrl } : {})
//   });

router.get(
  "/google/signup",
  attachOAuthStates("signup"),
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: typeof req.oAuthState === "string" ? req.oAuthState : undefined,
    })(req, res, next);
  },
);

router.get(
  "/google/signin",
  attachOAuthStates("signin"),
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: typeof req.oAuthState === "string" ? req.oAuthState : undefined,
    } as AuthenticateOptions)(req, res, next);
  },
);

router.get(
  "/google/callback",
  parseOAuthState,
  passport.authenticate("google",{
    session: false
  }),
  oauthCallback
);

export const adminAuthRoutes = () => router;
