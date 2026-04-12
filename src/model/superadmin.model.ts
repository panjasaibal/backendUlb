import type { ISuperAdmin } from "@panjasaibal/backend_ulb_shared";
import { PrismaModel } from "./prisma.model";

type SuperAdminProvider = "google" | "credentials";
type SuperAdminRole = "SUPERADMIN";

class SuperAdmin extends PrismaModel implements ISuperAdmin {
  _id = "";
  username = "";
  email = "";
  password?: string;
  provider: SuperAdminProvider = "google";
  role: SuperAdminRole = "SUPERADMIN";
  timestamp: Date = new Date();
  createdAt: Date = new Date();
  updatedAt: Date = new Date();

  constructor(data: Partial<SuperAdmin> = {}) {
    super(data as Record<string, unknown>);
  }
}

export { SuperAdmin, SuperAdminProvider, SuperAdminRole };
