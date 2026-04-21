import { findAdminById } from "@admin/services/admin.oauth.services";
import { findSuperAdminById } from "@admin/services/superAdmin.service";
import { Request, Response, NextFunction } from "express";

const fetchUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    switch (req.user?.role) {
      case "ADMIN":
        let currentAdmin = await findAdminById(req.user?.id!);
        if (!currentAdmin) {
          return res.status(401).json({ message: "unauthorized" });
        }
        return next();

      case "SUPERADMIN":
        let currentSuperdmin = await findSuperAdminById(req.user?.id!);
        if(!currentSuperdmin){
            return res.status(401).json({message:"unauthorized"})
        }
        return next();

      default:
        return res.status(401).json({ message: "unauthorized" });
    }
  
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export { fetchUser };
