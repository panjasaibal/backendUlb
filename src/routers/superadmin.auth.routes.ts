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

const router = Router();

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
