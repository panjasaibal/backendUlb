import { PrismaModel } from "./prisma.model";
import type { Administration } from "./adminstration";
import type { Worker } from "./workers";

class Supervisor extends PrismaModel {
  id = "";
  adminId = "";
  name = "";
  phone = "";
  address: string | null = null;
  profile: string | null = null;
  aadhar: string | null = null;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  adminRelation?: Administration;
  workers?: Worker[];

  constructor(data: Partial<Supervisor> = {}) {
    super(data as Record<string, unknown>);
  }

  get _id(): string {
    return this.id;
  }

  get admin(): string {
    return this.adminId;
  }

  get adhar(): string | null {
    return this.aadhar;
  }
}

export { Supervisor, Supervisor as SuperVisor };
