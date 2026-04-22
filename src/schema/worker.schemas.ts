import Joi from "joi";
import { WorkerDto } from "@admin/dto/worker.dto";

const createWorkerSchema = Joi.object<WorkerDto>({
  supervisorId: Joi.string().trim().required(),
  name: Joi.string().trim().min(2).max(120).required(),
  phone: Joi.string().trim().min(8).max(20).required(),
  address: Joi.string().trim().max(255).required(),
  aadhar: Joi.string().trim().max(32).required(),
});

const updateWorkerSchema = Joi.object<WorkerDto>({
  supervisorId: Joi.string().trim(),
  name: Joi.string().trim().min(2).max(120),
  phone: Joi.string().trim().min(8).max(20),
  address: Joi.string().trim().max(255),
  aadhar: Joi.string().trim().max(32)
}).min(1);


export {
    createWorkerSchema,
    updateWorkerSchema
};