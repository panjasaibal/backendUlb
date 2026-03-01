import { health } from "@admin/controller/health/get";
import express,{ Router } from "express";

const router:Router = express.Router();

export function healthRoutes():Router{
    router.get('/admin-health', health);
    return router;
}