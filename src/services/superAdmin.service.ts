import { SuperAdmin } from "@admin/model/superadmin.model";
import { BadRequestError, ISuperAdmin, NotFoundError } from "@panjasaibal/backend_ulb_shared";

async function createSuperAdmin(profile: { emails?: Array<{ value: string }>; displayName?: string }|undefined): Promise<ISuperAdmin> {
    const email = profile!.emails![0].value;
    const name = profile!.displayName;
    if (!email || !name) {
    throw new BadRequestError('Incomplete Google profile','superadmin service createSuperAdmin()');
  }
    const existedSuperAdmin: ISuperAdmin| null = await SuperAdmin.findOne({email: email});
    if(existedSuperAdmin){
        throw new BadRequestError('Super Admin already exists','superadmin service createSuperAdmin()');
    }

    const newSuperAdmin = await SuperAdmin.create({email, username:name, createdAt:Date.now(), updatedAt: Date.now()});
    const superAdminObject = newSuperAdmin.toObject();

    return {
        ...superAdminObject,
        _id: superAdminObject._id.toString()
    } as ISuperAdmin;
}

async function findSuperAdminByEmail(email:string):Promise<ISuperAdmin> {
    const superAdmin = await SuperAdmin.findOne({email});
    if(!superAdmin) throw new NotFoundError("Unauthorized","superadmin.service findSuperAdminByEmail() method");
    return {
        _id:superAdmin._id.toString(),
        email:superAdmin.email,
        username:superAdmin.username,
        createdAt:superAdmin.createdAt,
        updatedAt:superAdmin.updatedAt
    };

}






export { createSuperAdmin, findSuperAdminByEmail };
