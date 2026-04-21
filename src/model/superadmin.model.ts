import { PrismaModel } from "./prisma.model";

class SuperAdmin extends PrismaModel {
  id = "";
  username = "";
  email = "";
  password = "";
  createdAt: Date = new Date();
  updatedAt: Date = new Date();

  constructor(data: Partial<SuperAdmin> = {}) {
    super(data as Record<string, unknown>);
  }

  get _id(): string {
    return this.id;
  }
}

export { SuperAdmin };
