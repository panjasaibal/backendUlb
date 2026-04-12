import type { IWorker } from "@panjasaibal/backend_ulb_shared";
import { PrismaModel } from "./prisma.model";

class Worker extends PrismaModel implements IWorker {
  _id = "";
  admin = "";
  supervisor = "";
  name = "";
  phone = "";
  address: string | null = null;
  adhar: string | null = null;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();

  constructor(data: Partial<Worker> = {}) {
    super(data as Record<string, unknown>);
  }
}

export { Worker };
