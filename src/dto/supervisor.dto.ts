import Joi from "joi";

class CreateSupervisorDto {
  adminId = "";
  name = "";
  phone = "";
  address: string | null = null;
  profile: string | null = null;
  aadhar: string | null = null;

  constructor(data: Partial<CreateSupervisorDto> = {}) {
    Object.assign(this, data);
  }
}

class UpdateSupervisorDto {
  name?: string;
  phone?: string;
  address?: string | null;
  profile?: string | null;
  aadhar?: string | null;

  constructor(data: Partial<UpdateSupervisorDto> = {}) {
    Object.assign(this, data);
  }
}

const createSupervisorSchema = Joi.object<CreateSupervisorDto>({
  adminId: Joi.string().trim().required(),
  name: Joi.string().trim().min(2).max(120).required(),
  phone: Joi.string().trim().min(8).max(20).required(),
  address: Joi.string().trim().max(255).allow(null, ""),
  profile: Joi.string().trim().uri().allow(null, ""),
  aadhar: Joi.string().trim().max(32).allow(null, ""),
});

const updateSupervisorSchema = Joi.object<UpdateSupervisorDto>({
  name: Joi.string().trim().min(2).max(120),
  phone: Joi.string().trim().min(8).max(20),
  address: Joi.string().trim().max(255).allow(null, ""),
  profile: Joi.string().trim().uri().allow(null, ""),
  aadhar: Joi.string().trim().max(32).allow(null, ""),
}).min(1);

export {
  CreateSupervisorDto,
  UpdateSupervisorDto,
  createSupervisorSchema,
  updateSupervisorSchema,
};
