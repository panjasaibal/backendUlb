import { IWorker, NotFoundError } from "@panjasaibal/backend_ulb_shared";
import { findAdminById } from "./admin.oauth.services";
import { Worker } from "@admin/model/workers";
import { prisma } from "@admin/prisma";
import { WorkerDto } from "@admin/dto/worker.dto";



function toWorkerDto(record:{
  id: string;
    supervisorId: string;
    name: string;
    phone: string;
    address: string;
    aadhar: string;
    createdAt: Date;
    updatedAt: Date;
}): WorkerDto{
  return {
    id: record.id,
    supervisorId: record.supervisorId,
    name: record.name,
    phone: record.phone,
    address: record.address,
    aadhar: record.aadhar,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  }
}

async function findAllWorkerByAdmin(admin: string): Promise<Array<WorkerDto>> {
  const currentAdmin = await findAdminById(admin);
  if(!currentAdmin) throw new NotFoundError("admin does not exists","coming from worker service findAllWorkerByAdmin()");
  const allWorker = await prisma.worker.findMany({
    where:{
      supervisor:{
        adminId: currentAdmin.id
      }
    }
  });
  const allIWorker: WorkerDto[] = allWorker.map((worker) => (toWorkerDto(worker)));
  return allIWorker;
}

async function findWorkerById(worker_id: string): Promise<WorkerDto> {
  const worker = await prisma.worker.findUnique({
    where:{id: worker_id},
  });

  if (!worker)
    throw new NotFoundError(
      "Worker does not exists",
      "worker service findWorkerById() methd",
    );

  return toWorkerDto(worker);
}

async function findWorkersByAdmin(
  admin: string,
  payload: Partial<WorkerDto>,
): Promise<WorkerDto> {
  const currentAdmin = await findAdminById(admin);
  const supervisors = await 
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
