import { Request, Response } from "express";

import setAuthCookies from "@admin/cookie";
import { IAdmin } from "@panjasaibal/backend_ulb_shared";
import {
  createAdmin,
  findAdminByEmail,
} from "@admin/services/admin.oauth.services";
import { signAccessToken, signRefreshToken } from "@admin/util/jwt_manage";

type AdminOAuthRequest = Request & {
  oAuthState?: string | Record<string, unknown>;
};

interface GoogleProfile {
  emails?: Array<{ value: string }>;
  displayName?: string;
  oauthState?: string;
}

interface OAuthState {
  flow?: "signup" | "signin";
  callbackUrl?: string;
}

export const oauthCallback = async (req: AdminOAuthRequest, res: Response) => {
  const state =
    typeof req.oAuthState === "object" && req.oAuthState !== null
      ? (req.oAuthState as OAuthState)
      : {};
  const profile = req.user as GoogleProfile | undefined;
  const email = profile?.emails?.[0]?.value?.trim().toLowerCase();
  const fallbackName = email ? email.split("@")[0] : "Admin";
  const displayName = profile?.displayName?.trim() || fallbackName;

  if (state.flow === "signup") {
    if (!email) {
      return res.status(400).json({
        message: "Google account email is required for admin signup",
      });
    }

    const admin = await createAdmin({
      email,
      name: displayName,
    });


    setAuthCookies(res, admin.accessToken, admin.refreshToken);
    return res.redirect("http://localhost:3000/dashboard");
  }

  if (state.flow === "signin") {
    
    if (!email) {
      return res.status(400).json({
        message: "Google account email is required for admin signin",
      });
    }

    const admin = await findAdminByEmail(email);

    if (!admin) {
      return res.status(403).json({
        message: "Admin account not found for this Google account",
      });
    }

    if (String(admin.status) === "DISABLED") {
      return res.status(403).json({
        message: "Admin access has been revoked",
      });
    }

    const accessToken = signAccessToken(
      admin.id,
      admin.name,
      admin.email,
      "ADMIN",
    );
    const refreshToken = signRefreshToken(
      admin.id,
      admin.name,
      admin.email,
      "ADMIN"
    );

    setAuthCookies(res, accessToken, refreshToken);
    return res.redirect(`http://localhost:3000/dashboard/${admin.id}`);
  }

  return res.status(400).json({ message: "Unsupported OAuth flow" });
};
