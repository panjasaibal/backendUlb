import { clearAuthCookies } from "@admin/cookie";
import { NextFunction, Request, Response } from "express";

export function me(req:Request, res:Response, _: NextFunction){
    return res.json({ user: req.user});
}

export function logout(_:Request, res:Response){
    clearAuthCookies(res);

    return res.json({ message:"Logged out successfully" });
}
