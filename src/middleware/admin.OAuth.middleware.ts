import { config } from "@admin/config";
import { NextFunction, Request, Response } from "express";

type AdminOAuthRequest = Request & {
  oAuthState?: string | Record<string, unknown>;
};

const DEFAULT_CALLBACK_PATH = "/auth/admin/google/callback";

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

const getCallbackUrlFromState = (state: unknown): string => {
  if (typeof state !== "string") {
    return DEFAULT_CALLBACK_PATH;
  }

  try {
    const parsed = JSON.parse(state) as { callbackUrl?: string };
    return parsed.callbackUrl && allowedCallbacks.has(parsed.callbackUrl)
      ? parsed.callbackUrl
      : DEFAULT_CALLBACK_PATH;
  } catch {
    return DEFAULT_CALLBACK_PATH;
  }
};

const buildState = (
  flow: "signup" | "signin",
  superadmin?: string,
  callbackUrl?: string,
) =>
  JSON.stringify({
    flow,
    ...(superadmin ? { superadmin } : {}),
    ...(callbackUrl ? { callbackUrl } : {}),
  });

export const attachOAuthStates =
  (flow: "invite" | "signin") =>
  (req: AdminOAuthRequest, res: Response, next: NextFunction) => {
    const callbackUrl = getCallbackUrl(req);
    const superadmin =
      typeof req.query.superadmin === "string"
        ? req.query.superadmin
        : undefined;

    if (flow === "invite" && !superadmin) {
      return res.status(400).json({
        message: "superadmin is required for admin invite",
      });
    }
    const state: any = {
      flow,
      inviteToken:
        typeof req.query.inviteToken === "string"
          ? req.query.inviteToken
          : undefined,
      ...(flow === "invite" &&
        typeof req.query.superadmin === "string" && {
          superadmin: req.query.superadmin,
        }),
      callbackUrl,
    };

    req.oAuthState = JSON.stringify(state);
    next();
  };

export const parseOAuthState = (
  req: AdminOAuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rawState = req.query.state;

    if (typeof rawState !== "string") return next();

    const parsed = JSON.parse(rawState);

    req.oAuthState = parsed;
    next();
  } catch (e) {
    next();
  }
};
