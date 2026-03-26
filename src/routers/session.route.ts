import { logout, me } from "@admin/controller/auto-login/me.controller";
import express,{ Router } from "express";

const router:Router = express.Router();

export function sessionRouter():Router{
    router.get('/auth/me', me);

    router.post('/auth/logout', logout);
    
    return router;
}