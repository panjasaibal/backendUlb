import { PrismaModel } from "./prisma.model";
import type { Administration } from "./adminstration";
import type { Supervisor } from "./supervisor.model";

class Worker extends PrismaModel {
  id = "";
  adminId = "";
  supervisorId = "";
  name = "";
  phone = "";
  address: string | null = null;
  aadhar: string | null = null;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  adminRelation?: Administration;
  supervisorRelation?: Supervisor;

  constructor(data: Partial<Worker> = {}) {
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

  get supervisor(): string {
    return this.supervisorId;
  }
}

export { Worker };
