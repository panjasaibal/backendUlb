import { config } from "@admin/config";
import type { Response } from "express";

const secureCookies = config.NODE_ENV === "production";
const sameSite = "lax" as const;

function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: secureCookies,
    sameSite,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: secureCookies,
    sameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function setAccessTokenCookie(
  res: Response,
  accessToken: string,
  maxAge: number,
) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: secureCookies,
    sameSite,
    maxAge,
  });
}

function clearAuthCookies(res: Response) {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: secureCookies,
    sameSite,
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: secureCookies,
    sameSite,
  });
}

export { clearAuthCookies, setAccessTokenCookie };
export default setAuthCookies;
