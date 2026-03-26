import { NextFunction, Request, Response } from "express";

export function me(req:Request, res:Response, _: NextFunction){
    return res.json({ user: req.user});
}

export function logout(_:Request, res:Response){
    res.clearCookie("accesToken");
    res.clearCookie("refreshToken");

    return res.json({ message:"Logged out successfully" });
}