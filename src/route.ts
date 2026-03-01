import { Application } from "express";
import { healthRoutes } from "@admin/routers/health";


const BASE_PATH="/api/v1/ulbAdmin";

export const appRoutes = (app:Application)=>{
    app.use('', healthRoutes());
}