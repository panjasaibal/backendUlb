import setAuthCookies from '@admin/cookie';
import { signInSuperAdminSchema, signUpSuperAdminSchema } from '@admin/dto/superadmin-auth.dto';
import { signInSuperAdmin, signUpSuperAdmin } from '@admin/services/superAdmin.service';
import { Request, Response } from 'express';



export async function signIn(req:Request, res: Response) {
    const {value, error} = signInSuperAdminSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });

    if(error){
        return res.status(400).json({
            message:"Validation failed",
            error: error.details.map((item)=> item.message)
        });
    }

    const result = await signInSuperAdmin(value);
    setAuthCookies(res, result.accessToken, result.refreshToken);
    return res.status(200).json({message:"User signed in succesfully", user:result.user});
}
