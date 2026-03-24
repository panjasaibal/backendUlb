import { config } from "@admin/config";
import { NextFunction, Request, Response } from "express";

type SuperAdminOAuthRequest = Request & {
  superadmin_oAuthState?: string | Record<string, unknown>;
};

const DEFAULT_CALLBACK_PATH = "/auth/superadmin/google/callback";

const allowedCallbacks = new Set(
  (config.GOOGLE_ALLOWED_CALLBACK_URLS || "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean),
);

const getCallbackUrl = (req: Request): string => {
  const callbackUrl =
    typeof req.query.callbackUrl === "string"
      ? req.query.callbackUrl.trim()
      : "";

  if (!callbackUrl || callbackUrl === DEFAULT_CALLBACK_PATH) {
    return DEFAULT_CALLBACK_PATH;
  }

  return allowedCallbacks.has(callbackUrl)
    ? callbackUrl
    : DEFAULT_CALLBACK_PATH;
};


export const attachOAuthStates =
  (flow: "signup" | "signin") =>
  (req: SuperAdminOAuthRequest, res: Response, next: NextFunction) => {
    const callbackUrl = getCallbackUrl(req);

    const state: any = {
      flow,
      callbackUrl,
    };

    req.superadmin_oAuthState = JSON.stringify(state);
    next();
  };

export const parseOAuthState = (
  req: SuperAdminOAuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rawState = req.query.state;

    if (typeof rawState !== "string") return next();

    const parsed = JSON.parse(rawState);

    req.superadmin_oAuthState = parsed;
    next();
  } catch (e) {
    next();
  }
};
