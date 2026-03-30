import { IWorker, NotFoundError } from "@panjasaibal/backend_ulb_shared";
import { findAdminById } from "./admin.oauth.services";
import { Worker } from "@admin/model/workers";

async function findAllWorkerByAdmin(admin: string): Promise<Array<IWorker>> {
  const currentAdmin = await findAdminById(admin);
  const allWorker = await Worker.find({ admin: currentAdmin });
  const allIWorker: IWorker[] = allWorker.map((worker) => ({
    _id: worker._id.toString(),
    admin: worker.admin.toString(),
    supervisor: worker.supervisor.toString(),
    name: worker.name,
    phone: worker.phone,
    address: worker.address ?? null,
    adhar: worker.adhar ?? null,
    createdAt: worker.createdAt,
    updatedAt: worker.updatedAt,
  }));
  return allIWorker;
}

async function findWorkerById(worker_id: string): Promise<IWorker> {
  const worker = await Worker.findById(worker_id);
  if (!worker)
    throw new NotFoundError(
      "Worker does not exists",
      "worker service findWorkerById() methd",
    );

  return {
    _id: worker._id.toString(),
    admin: worker.admin.toString(),
    supervisor: worker.supervisor.toString(),
    name: worker.name,
    phone: worker.phone,
    address: worker.address ?? null,
    adhar: worker.adhar,
    createdAt: worker.createdAt,
    updatedAt: worker.updatedAt,
  };
}

async function findWorkerByAdmin(
  admin: string,
  payload: Partial<IWorker>,
): Promise<IWorker> {
  const currentAdmin = await findAdminById(admin);
  const worker = await Worker.findOne({ admin: currentAdmin, ...payload });
  if (!worker)
    throw new NotFoundError(
      "Worker does not exists",
      " worker service findWorkerByAdmin() method",
    );
  return {
    _id: worker._id.toString(),
    admin: worker.admin.toString(),
    supervisor: worker.supervisor.toString(),
    name: worker.name,
    phone: worker.phone,
    address: worker.address ?? null,
    adhar: worker.adhar ?? null,
    createdAt: worker.createdAt,
    updatedAt: worker.updatedAt,
  };
}

export { findAllWorkerByAdmin, findWorkerByAdmin, findWorkerById };
