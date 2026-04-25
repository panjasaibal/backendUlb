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
    data: {
      admin: {
        connect: {
          id: existedAdmin.id,
        },
      },
      name: supervisor.name,
      phone: supervisor.phone,
      address: supervisor.address,
      profile: supervisor.profile,
      aadhar: supervisor.aadhar,
    },
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
    where: {
      id: supervisor_id,
      adminId: adminId,
    },
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
): Promise<SupervisorDto> {
  const supervisor = await prisma.supervisor.findUnique({
    where: { id: supervisor_id },
  });
  if (supervisor === null)
    throw new NotFoundError(
      "Supervisor does not exists",
      "supervisor service findSupervisorById() methd",
    );

  return toSupervisorDto(supervisor);
}

async function findAllSupervisorByAdmin(
  admin_id: string,
): Promise<Array<SupervisorDto>> {
  const allSupervisors = await prisma.supervisor.findMany({
    where: { adminId: admin_id },
  });
  if (!allSupervisors || allSupervisors.length === 0)
    throw new NotFoundError(
      "Empty Supervisor list",
      "supervisor service findAllSupervisorByAdmin() methd",
    );

  let supervisors: Array<SupervisorDto> = allSupervisors.map((supervisor) =>
    toSupervisorDto(supervisor),
  );

  return supervisors;
}

async function updateSupervisor(
  supervisor_id: string,
  supervisor_body: Partial<SupervisorDto>,
): Promise<SupervisorDto> {
  const existed_supervisors = await prisma.supervisor.findUnique({
    where: { id: supervisor_id },
  });

  if (existed_supervisors === null) {
    throw new NotFoundError(
      "Supervisor does not exists",
      "supervisor service updateSupervisor() method",
    );
  }
  const newUpdatedSupervisor = await prisma.supervisor.update({
    where: { id: supervisor_id },

    data: {
      name: supervisor_body.name,
      phone: supervisor_body.phone,
      address: supervisor_body.address,
      profile: supervisor_body.profile,
      aadhar: supervisor_body.aadhar,
    },
  });

  return toSupervisorDto(newUpdatedSupervisor);
}

async function removeSupervisor(

  supervisor_id: string,
): Promise<boolean> {
  const existed_supervisors = await prisma.supervisor.findUnique({
    where: { id: supervisor_id },
  });

  if (existed_supervisors === null) {
    throw new NotFoundError(
      "Supervisor does not exists",
      "supervisor service updateSupervisor() method",
    );
  }

  const currentSupervisor = await prisma.supervisor.delete({
    where:{id:supervisor_id}
  });

  return currentSupervisor ? true : false;
}

function toSupervisorDto(record: {
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

export {
  createSupervisor,
  findSupervisorById,
  findSupervisorByAdminAndId,
  findAllSupervisorByAdmin,
  updateSupervisor,
  removeSupervisor,
};
