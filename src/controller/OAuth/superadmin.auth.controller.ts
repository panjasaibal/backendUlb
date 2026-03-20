import { Request, Response } from "express";

import setAuthCookies  from "@admin/cookie";
import { createSuperAdmin } from "@admin/services/superAdmin.service";
import { signAccessToken, signRefreshToken } from "@admin/util/jwt_manage";
import { ISuperAdmin } from "@panjasaibal/backend_ulb_shared";

export const oauthCallback = async (req: Request, res: Response) => {
  const profile = req.user as { emails?: Array<{ value: string }>; displayName?: string } | undefined;

  let flow: string | undefined;

  if (typeof req.query.state === "string") {
    try {
      const parsed = JSON.parse(req.query.state) as { flow?: string };
      flow = parsed.flow;
    } catch {
      return res.status(400).json({ message: "Invalid OAuth state" });
    }
  }

  
  if (flow === "signup") {
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

  return res.status(400).json({ message: "Unsupported OAuth flow" });
};
