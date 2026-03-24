import { Request, Response } from "express";

import setAuthCookies  from "@admin/cookie";
import { createSuperAdmin, findSuperAdminByEmail } from "@admin/services/superAdmin.service";
import { signAccessToken, signRefreshToken } from "@admin/util/jwt_manage";
import { ISuperAdmin } from "@panjasaibal/backend_ulb_shared";

interface OAuthStateSuperAdmin{
  flow?: "signup" | "signin";
  callbackUrl?: string;
}

type SuperAdminOAuthRequest = Request & {
  superadmin_oAuthState?: string | Record<string, unknown>;
};



export const oauthCallback = async (req: SuperAdminOAuthRequest, res: Response) => {
  const profile = req.user as { emails?: Array<{ value: string }>; displayName?: string } | undefined;

  const state =
    typeof req.superadmin_oAuthState === "object" &&
    req.superadmin_oAuthState !== null
      ? (req.superadmin_oAuthState as OAuthStateSuperAdmin)
      : {};

  
  if (state.flow === "signup") {
    const superAdmin:ISuperAdmin = await createSuperAdmin(profile);
    const superAdminId:string = String(superAdmin._id);
    const username:string = String(superAdmin.username);
    const superAdminEmail:string = String(superAdmin.email);
    const role:string = String(superAdmin.role);

    const accessToken = signAccessToken(
      superAdminId,
      username,
      superAdminEmail,
      role
    );
    const refreshToken = signRefreshToken(
      superAdminId,
      username,
      superAdminEmail,
      role
    );

    setAuthCookies(res, accessToken, refreshToken);

    return res.redirect("http://localhost:3000/dashboard");
  }
  else if(state.flow === "signin"){
    const superAdmin = await findSuperAdminByEmail(profile!.emails![0].value);
    const accessToken = signAccessToken(
      superAdmin._id!,
      superAdmin.username,
      superAdmin.email,
      superAdmin.role!
    );
    const refreshToken = signRefreshToken(
      superAdmin._id!,
      superAdmin.username,
      superAdmin.email,
      superAdmin.role!
    );

    setAuthCookies(res, accessToken, refreshToken);
    return res.redirect("http://localhost:3000/dashboard");
  }

  return res.status(400).json({ message: "Unsupported OAuth flow" });
};
