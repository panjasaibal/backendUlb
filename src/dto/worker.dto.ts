import Joi from "joi";

class CreateWorkerDto {
  adminId = "";
  supervisorId = "";
  name = "";
  phone = "";
  address: string | null = null;
  aadhar: string | null = null;

  constructor(data: Partial<CreateWorkerDto> = {}) {
    Object.assign(this, data);
  }
}

class UpdateWorkerDto {
  supervisorId?: string;
  name?: string;
  phone?: string;
  address?: string | null;
  aadhar?: string | null;

  constructor(data: Partial<UpdateWorkerDto> = {}) {
    Object.assign(this, data);
  }
}

const createWorkerSchema = Joi.object<CreateWorkerDto>({
  adminId: Joi.string().trim().required(),
  supervisorId: Joi.string().trim().required(),
  name: Joi.string().trim().min(2).max(120).required(),
  phone: Joi.string().trim().min(8).max(20).required(),
  address: Joi.string().trim().max(255).allow(null, ""),
  aadhar: Joi.string().trim().max(32).allow(null, ""),
});

const updateWorkerSchema = Joi.object<UpdateWorkerDto>({
  supervisorId: Joi.string().trim(),
  name: Joi.string().trim().min(2).max(120),
  phone: Joi.string().trim().min(8).max(20),
  address: Joi.string().trim().max(255).allow(null, ""),
  aadhar: Joi.string().trim().max(32).allow(null, ""),
}).min(1);

export {
  CreateWorkerDto,
  UpdateWorkerDto,
  createWorkerSchema,
  updateWorkerSchema,
};
