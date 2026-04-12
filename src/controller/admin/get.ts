import { findAllSupervisorByAdmin, findSupervisorById } from "@admin/services/supervisor.service";
import { findAllWorkerByAdmin, findWorkerByAdmin } from "@admin/services/worker.service";
import { ApiResponse, IWorker } from "@panjasaibal/backend_ulb_shared";
import { Request, Response } from "express";

type GetSupervisorParams = {
  id: string;
};

async function getAllWorker (req:Request, res:Response){
  const workers = await findAllWorkerByAdmin(req.user?.id!);
  return res.status(200).json(new ApiResponse(200, workers, workers.length.toString(), true));
};


async function getWorker (req:Request<Record<string, never>, unknown, unknown, Partial<IWorker>>, res:Response){
  const worker = await findWorkerByAdmin(req.user?.id!, req.query);
  return res.status(200).json(new ApiResponse(200, worker, "", true));
};

async function getAllSupervisor (req:Request, res:Response){
  const workers = await findAllSupervisorByAdmin(req.user?.id!);
  return res.status(200).json(new ApiResponse(200, workers, workers.length.toString(), true));
};


async function getSupervisor (req:Request<GetSupervisorParams>, res:Response){
  const supervisor = await findSupervisorById(req.params.id);
  return res.status(200).json(new ApiResponse(200, supervisor, "", true));
};



export { getAllWorker, getWorker, getAllSupervisor, getSupervisor };
