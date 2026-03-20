import { config } from "@admin/config";
import { sign } from "jsonwebtoken";

export function signAccessToken(id:string, username:string, email:string,role:string):string{
    return sign({id,username,email, role},config.JWT_TOKEN!,{
        expiresIn:"15m"
    });
}

export function signRefreshToken(id:string, username:string, email:string,role:string):string{
    return sign({id,username,email, role},config.JWT_TOKEN!,{
        expiresIn:"7d"
    });
}

