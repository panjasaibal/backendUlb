import { Application } from "express";
import { healthRoutes } from "@admin/routers/health";
import { adminAuthRoutes } from "@admin/routers/admin.auth.routes";
import { superAdminAuthRoutes } from "@admin/routers/superadmin.auth.routes";


const BASE_PATH="/api/v1/ulbAdmin";

export const appRoutes = (app:Application)=>{
    app.use('', healthRoutes());
    app.use("/auth/admin", adminAuthRoutes());
    app.use("/auth/superadmin", superAdminAuthRoutes());
}
