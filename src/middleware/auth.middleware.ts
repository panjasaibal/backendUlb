import { config } from "@admin/config";
import { findAdminById } from "@admin/services/admin.oauth.services";
import { findSuperAdminById } from "@admin/services/superAdmin.service";
import { SessionTimeoutError } from "@panjasaibal/backend_ulb_shared";
import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt, { TokenExpiredError } from 'jsonwebtoken';

interface UserDecoded extends jwt.JwtPayload{
    id:string;
    username: string;
    email: string;
    role: "ADMIN"|"SUPERADMIN";
}



export const authenticateUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
    try{
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(accessToken, config.JWT_TOKEN!) as UserDecoded;
        const {role, id} = decoded;

        switch (role){
          case "SUPERADMIN": {
            const superadmin = await findSuperAdminById(id);
            req.user = {
              id: superadmin._id,
              _id: superadmin._id,
              role: "SUPERADMIN",
            };
            return next();
          }

          case "ADMIN": {
            const admin = await findAdminById(id);
            if (String(admin.status) === "REVOKED") {
              return res.status(403).json({ message: "Admin access has been revoked" });
            }
            req.user = {
              id: admin._id,
              _id: admin._id,
              role: "ADMIN",
            };
            return next();
          }

          default:
            return res.status(401).json({ message: "Unauthorized" });
        }

    }catch(e){
        if(e instanceof TokenExpiredError){
          return next(new SessionTimeoutError("session timed out", "auth middleware authecticateUser() method", "token_expire_error"));
        }
        return next(e);
    }
};

export const requireSuperAdmin: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== "SUPERADMIN") {
    return res.status(403).json({ message: "Only superadmins can access this resource" });
  }

  return next();
};
