import setAuthCookies from '@admin/cookie';
import { signUpSuperAdminSchema } from '@admin/dto/superadmin-auth.dto';
import { signUpSuperAdmin } from '@admin/services/superAdmin.service';
import { Request, Response } from 'express';



export async function signup(req:Request, res: Response) {
    const {value, error} = signUpSuperAdminSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });

    if(error){
        return res.status(400).json({
            message:"Validation failed",
            error: error.details.map((item)=> item.message)
        });
    }

    const result = await signUpSuperAdmin(value);
    setAuthCookies(res, result.accessToken, result.refreshToken);
    return res.status(201).json({message:"User signed up succesfully"});
}