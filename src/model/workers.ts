import { PrismaModel } from "./prisma.model";
import type { Supervisor } from "./supervisor.model";

class Worker extends PrismaModel {
  id = "";
  supervisorId = "";
  name = "";
  phone = "";
  address: string | null = null;
  aadhar: string | null = null;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  supervisorRelation?: Supervisor;

  constructor(data: Partial<Worker> = {}) {
    super(data as Record<string, unknown>);
  }

  get _id(): string {
    return this.id;
  }

  get adhar(): string | null {
    return this.aadhar;
  }

  get supervisor(): string {
    return this.supervisorId;
  }
}

export { Worker };
