import Joi from "joi";
import { SupervisorDto } from "@admin/dto/supervisor.dto";

const createSupervisorSchema = Joi.object<SupervisorDto>({
  adminId: Joi.string().trim().required(),
  name: Joi.string().trim().min(2).max(120).required(),
  phone: Joi.string().trim().min(8).max(20).required(),
  address: Joi.string().trim().max(255).allow(null, ""),
  profile: Joi.string().trim().uri().allow(null, ""),
  aadhar: Joi.string().trim().max(32).allow(null, ""),
});

const updateSupervisorSchema = Joi.object<SupervisorDto>({
  name: Joi.string().trim().min(2).max(120),
  phone: Joi.string().trim().min(8).max(20),
  address: Joi.string().trim().max(255).allow(null, ""),
  profile: Joi.string().trim().uri().allow(null, ""),
  aadhar: Joi.string().trim().max(32).allow(null, ""),
}).min(1);

export {
  createSupervisorSchema,
  updateSupervisorSchema,
};