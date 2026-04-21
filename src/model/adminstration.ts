import { PrismaModel } from "./prisma.model";
import type { SubscriptionPlan } from "./subscription";
import type { Supervisor } from "./supervisor.model";
import type { Worker } from "./workers";

type AdminProvider = "google" | "credentials";
type AdminStatus = "PENDING" | "ACTIVE" | "DISABLED";

class Administration extends PrismaModel {
  id = "";
  name = "";
  email = "";
  provider: AdminProvider = "google";
  phoneNumber: string | null = null;
  access = true;
  profileComplete = false;
  status: AdminStatus = "ACTIVE";
  subscription: SubscriptionPlan = "FREE";
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  supervisors?: Supervisor[];
  

  constructor(data: Partial<Administration> = {}) {
    super(data as Record<string, unknown>);
  }

  get _id(): string {
    return this.id;
  }

  get superadmin(): string {
    return "";
  }
}

export {
  AdminStatus,
  AdminProvider,
  Administration,
  Administration as Adminstration,
};
