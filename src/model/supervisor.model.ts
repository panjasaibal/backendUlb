import type { ISupervisor } from "@panjasaibal/backend_ulb_shared";
import { PrismaModel } from "./prisma.model";

class SuperVisor extends PrismaModel implements ISupervisor {
  _id = "";
  admin = "";
  name = "";
  phone = "";
  address: string | null = null;
  profile: string | null = null;
  adhar: string | null = null;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();

  constructor(data: Partial<SuperVisor> = {}) {
    super(data as Record<string, unknown>);
  }
}

export { SuperVisor };
