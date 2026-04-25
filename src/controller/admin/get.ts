import {
  findAllSupervisorByAdmin,
  findSupervisorById,
} from "@admin/services/supervisor.service";
import { findCurrentTrackerByUser_id } from "@admin/services/tracker.service";
import {
  findAllWorkerByAdmin,
  findWorkerById,
} from "@admin/services/worker.service";
import { ApiResponse, IWorker } from "@panjasaibal/backend_ulb_shared";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { PreMiddlewareFunction } from "mongoose";

type GetSupervisorParams = {
  id: string;
};

export class Get {

  public async getAllWorker(req: Request, res: Response) {
    const workers = await findAllWorkerByAdmin(req.user?.id!);
    res
      .status(StatusCodes.OK)
      .json(new ApiResponse(200, workers, workers.length.toString(), true));
  }

  async getWorker(req: Request, res: Response) {
    const worker = await findWorkerById(req.params.id as string);
    res.status(StatusCodes.OK).json(new ApiResponse(200, worker, "", true));
  }

  async getAllSupervisor(req: Request, res: Response) {
    const workers = await findAllSupervisorByAdmin(req.user?.id!);
    res
      .status(StatusCodes.OK)
      .json(new ApiResponse(200, workers, workers.length.toString(), true));
  }

  async getSupervisor(req: Request<GetSupervisorParams>, res: Response) {
    const supervisor = await findSupervisorById(req.params.id);
    res.status(StatusCodes.OK).json(new ApiResponse(200, supervisor, "", true));
  }

  async getCurrentTracker(req:Request, res: Response):Promise<void>{
    const tracker = await findCurrentTrackerByUser_id(req.params.user_id as string);
    res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, tracker, undefined, true));
  }
}


