import {
  BadRequestError,
  ISupervisor,
  NotAuthorizedError,
  NotFoundError,
} from "@panjasaibal/backend_ulb_shared";

import { findAdminById } from "./admin.oauth.services";
import { SupervisorDto } from "@admin/dto/supervisor.dto";
import { prisma } from "@admin/prisma";


async function createSupervisor(supervisor: SupervisorDto): Promise<string> {
  

  const existedAdmin = await findAdminById(supervisor.adminId);
  if (!existedAdmin)
    throw new BadRequestError(
      "Admin does not exists",
      "supervisor service createSupervisor() methd",
    );

  const newSupervisor = await prisma.supervisor.create({
    data:{
      admin: {
        connect:{
          id: existedAdmin.id
        }
      },
      name: supervisor.name,
      phone: supervisor.phone,
      address: supervisor.address,
      profile: supervisor.profile,
      aadhar: supervisor.aadhar,
    }
  });

  return newSupervisor.id;
}

async function findSupervisorByAdminAndId(
  adminId: string,
  supervisor_id: string,
): Promise<SupervisorDto> {
  const existedAdmin = await findAdminById(adminId);
  if (!existedAdmin)
    throw new NotAuthorizedError(
      "Admin does not exists",
      "supervisor service findSupervisorById() methd",
    );

  const supervisor = await prisma.supervisor.findUnique({
    where:{
      id: supervisor_id,
      adminId: adminId
    }
  });
  if (!supervisor)
    throw new NotFoundError(
      "Supervisor does npt exists",
      "supervisor service findSupervisorById() methd",
    );

  return toSupervisorDto(supervisor);
}


async function findSupervisorById(
  supervisor_id: string,
): Promise<ISupervisor> {
  

  const supervisor = await SuperVisor.findById(supervisor_id);
  if (!supervisor)
    throw new NotFoundError(
      "Supervisor does npt exists",
      "supervisor service findSupervisorById() methd",
    );

  return toISupervisor(supervisor);
}


async function findAllSupervisorByAdmin(
  admin_id: string,
): Promise<Array<ISupervisor>> {
  

  const allSupervisors = await SuperVisor.find({admin: admin_id});
  if (!allSupervisors || allSupervisors.length ===0)
    throw new NotFoundError(
      "Empty Supervisor list",
      "supervisor service findAllSupervisorByAdmin() methd",
    );
  
  let supervisors: Array<ISupervisor> = allSupervisors.map((supervisor)=>toISupervisor(supervisor));

  return supervisors;
}

async function updateSupervisor(
  admin_id: string,
  supervisor_id: string,
  supervisor_body: Partial<ISupervisor>,
):Promise<ISupervisor> {
  const existedAdmin = await findAdminById(admin_id);
  if (!existedAdmin)
    throw new NotAuthorizedError(
      "Admin does not exists",
      "supervisor service updateSupervisor() methd",
    );

  const newUpdatedSupervisor = await SuperVisor.findOneAndUpdate(
    { _id: supervisor_id, admin: admin_id },
    { $set: { supervisor_body } },
  );

  return toSupervisorDto(newUpdatedSupervisor as SupervisorDoc);
}

async function removeSupervisor(adminId: string, supervisor_id: string):Promise<boolean> {
    const existedAdmin = await findAdminById(adminId);
    if (!existedAdmin)
    throw new NotAuthorizedError(
      "Admin does not exists",
      "supervisor service removeSupervisor() methd",
    );

    const currentSupervisor = await SuperVisor.findOneAndDelete({ _id: supervisor_id, admin: adminId });

    return currentSupervisor?true:false; 
}

function toSupervisorDto(record:{
    id: string;
    name: string;
    phone: string;
    address: string | null;
    profile: string | null;
    aadhar: string;
    createdAt: Date;
    updatedAt: Date;
    adminId: string;
}): SupervisorDto {
  return {
    id: record.id,
    adminId: record.adminId,
    aadhar: record.aadhar,
    name: record.name,
    phone: record.phone,
    profile: record.profile ?? null,
    address: record.address ?? null,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}


export { createSupervisor, findSupervisorById, findSupervisorByAdminAndId, findAllSupervisorByAdmin, updateSupervisor, removeSupervisor };
