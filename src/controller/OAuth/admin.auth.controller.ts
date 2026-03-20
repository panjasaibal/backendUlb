import { Request, Response } from "express";

import setAuthCookies from "@admin/cookie";
import { IAdmin } from "@panjasaibal/backend_ulb_shared";
import { createAdmin, getAdminByEmail } from "@admin/services/admin.oauth.services";
import { signAccessToken, signRefreshToken } from "@admin/util/jwt_manage";

interface GoogleProfile {
  emails?: Array<{ value: string }>;
  displayName?: string;
  oauthState?: string;
}

interface OAuthState {
  flow?: "signup" | "signin";
  superadmin?: string;
  callbackUrl?: string;
}
export const oauthCallback = async (req: Request, res: Response) => {
  const profile = req.user as GoogleProfile | undefined;
  const state =
    typeof req.oAuthState === "object" && req.oAuthState !== null
      ? (req.oAuthState as OAuthState)
      : {};

  let admin: IAdmin | null = null;
  const email = profile?.emails?.[0]?.value;

  if (state.flow === "signup") {
    if (!state.superadmin) {
      return res.status(400).json({ message: "Missing superadmin for signup flow" });
    }

    admin = await createAdmin(profile, state.superadmin);
  } else if (state.flow === "signin") {
    if (!email) {
      return res.status(400).json({ message: "Email missing from Google profile" });
    }

    admin = await getAdminByEmail(email);
  } else {
    return res.status(400).json({ message: "Unsupported OAuth flow" });
  }

  if (!admin) {
    return res.status(404).json({ message: "Admin account not found" });
  }

  const accessToken = signAccessToken(
    String(admin._id),
    String(admin.name),
    String(admin.email),
    String(admin.role)
  );
  const refreshToken = signRefreshToken(
    String(admin._id),
    String(admin.name),
    String(admin.email),
    String(admin.role)
  );

  setAuthCookies(res, accessToken, refreshToken);

  const profileComplete = Boolean(
    (admin as IAdmin & { profileComplete?: boolean }).profileComplete
  );

  return res.redirect(
    `http://localhost:3000/${profileComplete ? "dashboard" : "complete-profile"}`
  );
};
