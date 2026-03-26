import { Application } from "express";
import { healthRoutes } from "@admin/routers/health";
import { adminAuthRoutes } from "@admin/routers/admin.auth.routes";
import { superAdminAuthRoutes } from "@admin/routers/superadmin.auth.routes";
import { authenticateUser } from "@admin/middleware/auth.middleware";
import { sessionRouter } from "@admin/routers/session.route";


const BASE_PATH="/api/v1/ulbAdmin";


export const appRoutes = (app:Application)=>{
    app.use('', healthRoutes());
    app.use(BASE_PATH, adminAuthRoutes());
    app.use(BASE_PATH, superAdminAuthRoutes());


    app.use(BASE_PATH, authenticateUser, sessionRouter());
}
