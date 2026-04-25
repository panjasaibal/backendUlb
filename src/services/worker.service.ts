import { NotFoundError } from "@panjasaibal/backend_ulb_shared";
import { findAdminById } from "./admin.oauth.services";

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

async function addWorker(worker:WorkerDto):Promise<string> {
  const supervisor = await prisma.supervisor.findUnique({
    where:{
      id:worker.supervisorId
    },
    select:{
      id: true,
      phone: true,
      name: true
    }
  });

  if(!supervisor){
    throw new NotFoundError(
      "Supervisor does not exists",
      "Worker service addWorker() method",
    );
  }

  const newWorker = await prisma.worker.create({
    data:{
      supervisor:{
        connect:{
          id: supervisor.id
        }
      },
      name: worker.name,
      phone: worker.phone,
      address: worker.address||"",
      aadhar: worker.aadhar
    },
    select:{
      id: true
    }

  });
  return newWorker.id;

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

async function findWorkersBySupervisor(
  supervisor_id: string,
  payload: Partial<WorkerDto>,
): Promise<Array<WorkerDto>> {
  
  const supervisor = await prisma.supervisor.findFirst({where:{id:supervisor_id}});
  if (!supervisor)
    throw new NotFoundError(
      "Supervisor does not exists",
      "Worker service findWorkerBySupervisor() method",
    );
   const allWorker = await prisma.worker.findMany({
    where:{
      supervisorId:supervisor.id
    }
  });

  const allIWorker: WorkerDto[] = allWorker.map((worker) => (toWorkerDto(worker)));
  return allIWorker;
}


async function updateWorker(
  worker_id: string,
  worker_body: Partial<WorkerDto>,
): Promise<WorkerDto> {
  const existed_worker = await prisma.worker.findUnique({
    where: { id: worker_id},
  });

  if (existed_worker === null) {
    throw new NotFoundError(
      "Worker does not exists",
      "worker service updateWorker() method",
    );
  }
  const newUpdatedWorker= await prisma.worker.update({
    where: { id: worker_id },

    data: {
      name: worker_body.name,
      phone: worker_body.phone,
      address: worker_body.address!,
      aadhar: worker_body.aadhar,
    },
  });

  return toWorkerDto(newUpdatedWorker);
}

async function removeWorker(

  worker_id: string,
): Promise<boolean> {
  const existed_worker = await prisma.worker.findUnique({
    where: { id: worker_id },
  });

  if (existed_worker === null) {
    throw new NotFoundError(
      "worker does not exists",
      "worker service updateworker() method",
    );
  }

  const currentWorker = await prisma.worker.delete({
    where:{id:worker_id}
  });

  return currentWorker ? true : false;
}

export { addWorker, findAllWorkerByAdmin, findWorkersBySupervisor, findWorkerById, updateWorker, removeWorker };
