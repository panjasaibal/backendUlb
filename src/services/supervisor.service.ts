import {
  BadRequestError,
  ISupervisor,
  NotAuthorizedError,
  NotFoundError,
} from "@panjasaibal/backend_ulb_shared";
import { findAdminById } from "./admin.oauth.services";
import { SuperVisor } from "@admin/model/supervisor.model";

type SupervisorDoc = InstanceType<typeof SuperVisor>;

async function createSupervisor(supervisor: ISupervisor): Promise<string> {
  const adminId = supervisor.admin;

  const existedAdmin = await findAdminById(adminId);
  if (!existedAdmin)
    throw new BadRequestError(
      "Admin does not exists",
      "supervisor service createSupervisor() methd",
    );

  const newSupervisor = await SuperVisor.create(supervisor);

  return newSupervisor._id.toString();
}

async function findSupervisorByAdminAndId(
  adminId: string,
  supervisor_id: string,
): Promise<ISupervisor> {
  const existedAdmin = await findAdminById(adminId);
  if (!existedAdmin)
    throw new NotAuthorizedError(
      "Admin does not exists",
      "supervisor service findSupervisorById() methd",
    );

  const supervisor = await SuperVisor.findOne({
    _id: supervisor_id,
    admin: adminId,
  });
  if (!supervisor)
    throw new NotFoundError(
      "Supervisor does npt exists",
      "supervisor service findSupervisorById() methd",
    );

  return toISupervisor(supervisor);
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

  return toISupervisor(newUpdatedSupervisor as SupervisorDoc);
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

function toISupervisor(supervisor: SupervisorDoc): ISupervisor {
  return {
    _id: supervisor._id.toString(),
    admin: supervisor.admin.toString(),
    adhar: supervisor.adhar ?? null,
    name: supervisor.name,
    phone: supervisor.phone,
    profile: supervisor.profile ?? null,
    address: supervisor.address ?? null,
    createdAt: supervisor.createdAt,
    updatedAt: supervisor.updatedAt,
  };
}


export { createSupervisor, findSupervisorById, findSupervisorByAdminAndId, updateSupervisor, removeSupervisor };
