import { updateSupervisor } from "@admin/services/supervisor.service";
import { ApiResponse } from "@panjasaibal/backend_ulb_shared";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { updateWorker } from "@admin/services/worker.service";

export class Update{

    public async update_supervisor(req:Request, res: Response):Promise<void>{
        const supervisor = await updateSupervisor(req.params.supervisor_id as string, req.body);
        res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, supervisor,"Supervisor updated successfully", true));
    }

    public async update_worker(req:Request, res: Response):Promise<void>{
        const worker = await updateWorker(req.params.worker_id as string, req.body);
        res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, worker,"Worker updated successfully", true));
    }

}