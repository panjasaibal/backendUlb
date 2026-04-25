import { createSupervisor } from "@admin/services/supervisor.service";
import { addWorker } from "@admin/services/worker.service";
import { Request, Response } from "express";
import { StatusCodes } from 'http-status-codes';

export class Create{

    public async supervisor(req:Request, res: Response): Promise<void>{
        const supervisor_id = await createSupervisor(req.body);
        res.status(StatusCodes.CREATED).json({message:`Supervisor cretaed with: ${supervisor_id}`});
    }

    public async worker(req:Request, res: Response): Promise<void>{
        const supervisor_id = await addWorker(req.body);
        res.status(StatusCodes.CREATED).json({message:`worker created with: ${supervisor_id}`});
    }
}