import { SuperAdmin } from "@admin/model/superadmin.model";
import { ISuperAdmin, NotFoundError } from "@panjasaibal/backend_ulb_shared";

export async function findSuperAdminById(id:string):Promise<ISuperAdmin> {
    const superAdmin = await SuperAdmin.findById(id);
    if(!superAdmin) throw new NotFoundError("superadmin does not exists!", "superadmin service findSuperAdminById() method");

    return {
        _id:(superAdmin._id).toString(),
        username: superAdmin.username,
        role: superAdmin.role,
        email: superAdmin.email,
        createdAt: superAdmin.createdAt,
        updatedAt: superAdmin.updatedAt
    }
}
