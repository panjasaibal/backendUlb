import { findAllWorkerByAdmin, findWorkerByAdmin } from "@admin/services/worker.service";
import { ApiResponse } from "@panjasaibal/backend_ulb_shared";
import { Request, Response } from "express";

async function getAllWorker (req:Request, res:Response){
  const workers = await findAllWorkerByAdmin(req.user?.id!);
  if (workers?.length === 0 || workers === null) {
    return res.status(204).json({ message: "no wrokers present" });
  }
  return res.status(200).json(new ApiResponse(200, workers, workers.length.toString(), true));
};


async function getWorker (req:Request, res:Response){
  const worker = await findWorkerByAdmin(req.user?.id!, req.query);
  if (worker === null) {
    return res.status(204).json({ message: "no wrokers present" });
  }
  return res.status(200).json(new ApiResponse(200, worker, "", true));
};



export { getAllWorker, getWorker };
