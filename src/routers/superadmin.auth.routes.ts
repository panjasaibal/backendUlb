import { Router } from "express";
import {
  authenticateUser,
  requireSuperAdmin,
} from "@admin/middleware/auth.middleware";
import {
  deleteAdmin,
  getAdminSubscriptionStatus,
  revokeAdminAccess,
} from "@admin/controller/superadmin/admin.management.controller";
import { signup } from "@admin/controller/superadmin/sign-up";
import { signIn } from "@admin/controller/superadmin/sign-in";

const router = Router();

router.post("/superadmin/sign-up",signup);
router.post("/superadmin/sign-in",signIn);

router.patch(
  "/superadmin/admins/:id/revoke-access",
  authenticateUser,
  requireSuperAdmin,
  revokeAdminAccess,
);

router.delete(
  "/superadmin/admins/:id",
  authenticateUser,
  requireSuperAdmin,
  deleteAdmin,
);

router.get(
  "/superadmin/admins/:id/subscription",
  authenticateUser,
  requireSuperAdmin,
  getAdminSubscriptionStatus,
);

export const superAdminAuthRoutes = () => router;
