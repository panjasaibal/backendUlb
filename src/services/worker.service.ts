import { IWorker } from "@panjasaibal/backend_ulb_shared";
import { findAdminById } from "./admin.oauth.services";
import { Worker } from "@admin/model/workers";

async function findAllWorkerByAdmin(
  admin: string,
): Promise<Array<IWorker> | null> {
  try {
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

  } catch (e) {
    return null;
  }
}

async function findWorkerByAdmin(admin:string, payload:Partial<IWorker>):Promise<IWorker|null>{
    const currentAdmin = await findAdminById(admin);
    const worker = await Worker.findOne({ admin: currentAdmin, ...payload });
    return worker? {
      _id: worker!._id.toString(),
      admin: worker!.admin.toString(),
      supervisor: worker!.supervisor.toString(),
      name: worker!.name,
      phone: worker!.phone,
      address: worker!.address ?? null,
      adhar: worker!.adhar ?? null,
      createdAt: worker!.createdAt,
      updatedAt: worker!.updatedAt,
    }: null;
}





export { findAllWorkerByAdmin, findWorkerByAdmin };
