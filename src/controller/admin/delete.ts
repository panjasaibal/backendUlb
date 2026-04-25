import { removeSupervisor } from "@admin/services/supervisor.service";
import { removeWorker } from "@admin/services/worker.service";
import { Request, Response } from "express";
import { StatusCodes } from 'http-status-codes';

export class Delete{

    public async supervisor(req:Request, res: Response): Promise<void>{
        const operation = await removeSupervisor(req.params.supervisor_id as string);
        res.status(StatusCodes.OK).json({message:"Supervisor deleted successfully"});
    }

    public async worker(req:Request, res: Response): Promise<void>{
        const operation = await removeWorker(req.params.worker_id as string);
        res.status(StatusCodes.OK).json({message:"Worker deleted successfully"});
    }
}