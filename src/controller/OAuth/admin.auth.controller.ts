import { NextFunction, Request, RequestHandler, Response } from "express";

import setAuthCookies from "@admin/cookie";
import { IAdmin } from "@panjasaibal/backend_ulb_shared";
import {
  createAdmin,
  findAdminByToken,
  getAdminByEmail,
  updateAdmin,
} from "@admin/services/admin.oauth.services";
import { signAccessToken, signRefreshToken } from "@admin/util/jwt_manage";
import { sendInvitationMail } from "@admin/mailer";

type AdminOAuthRequest = Request & {
  oAuthState?: string | Record<string, unknown>;
};

interface GoogleProfile {
  emails?: Array<{ value: string }>;
  displayName?: string;
  oauthState?: string;
}

interface OAuthState {
  flow?: "invite" | "signin";
  superadmin?: string;
  inviteToken?: string;
  callbackUrl?: string;
}

export const oauthCallback = async (req: AdminOAuthRequest, res: Response) => {
  const state =
    typeof req.oAuthState === "object" && req.oAuthState !== null
      ? (req.oAuthState as OAuthState)
      : {};

  if (state.flow === "signin") {
    let admin: IAdmin | null = null;
    const inviteToken = req.query.token as string;

    if (inviteToken) {
      admin = await findAdminByToken(inviteToken);
      const updatedAdmin = await updateAdmin(admin!.email, {
        status: "ACTIVE",
      });
      console.log("updated admin", updatedAdmin);
    } else {
      const profile = req.user as GoogleProfile | undefined;
      admin = await getAdminByEmail(
        profile?.emails?.[0]?.value?.trim().toLowerCase()!,
      );
    }

    const accessToken = signAccessToken(
      admin!._id!,
      admin!.name,
      admin!.email,
      admin!.role!,
    );
    const refreshToken = signRefreshToken(
      admin!._id!,
      admin!.name,
      admin!.email,
      admin!.role!,
    );

    setAuthCookies(res, accessToken, refreshToken);
    res.redirect("http://localhost:3000/dashboard");
  }
};

export const inviteAdmin: RequestHandler = async (
  req: Request,
  res: Response,
  _: NextFunction,
) => {
  const { email, name } = req.body;
  const superadmin = req.user?.superAdminId;

  if (!superadmin) {
    return res.status(403).json({
      message: "Only superadmins can invite admins",
    });
  }

  const admin = await createAdmin({
    name,
    email,
    superadmin,
    phoneNumber: "",
    updatedAt: new Date(),
    createdAt: new Date(),
  });
  const inviteUrl = `http://localhost:3000/admin/accept-invite?token=${admin.inviteToken}`;

  const mailId = sendInvitationMail(admin.email, admin.name, inviteUrl);
  console.log("Mail sent to the emailid", mailId);
  return res.status(201).json({
    message: "Admin invitation sent successfully",
    admin,
  });
};
