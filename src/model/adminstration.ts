import { PrismaModel } from "./prisma.model";
import type { SubscriptionPlan } from "./subscription";

type AdminProvider = "google" | "credentials";
type AdminRole = "ADMIN" | "SUPERADMIN";
type AdminStatus = "PENDING" | "ACTIVE" | "REVOKED";

class Adminstration extends PrismaModel {
  _id = "";
  name = "";
  email = "";
  password?: string;
  provider: AdminProvider = "google";
  phoneNumber?: string;
  access = true;
  profileComplete = false;
  role: AdminRole = "ADMIN";
  status: AdminStatus = "ACTIVE";
  subscription: SubscriptionPlan = "FREE";
  createdAt: Date = new Date();
  updatedAt: Date = new Date();

  constructor(data: Partial<Adminstration> = {}) {
    super(data as Record<string, unknown>);
  }
}

export { AdminRole, AdminStatus, AdminProvider, Adminstration };
