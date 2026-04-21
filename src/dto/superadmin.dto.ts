import Joi from "joi";

class CreateSuperAdminDto {
  username = "";
  email = "";
  password = "";

  constructor(data: Partial<CreateSuperAdminDto> = {}) {
    Object.assign(this, data);
  }
}

class UpdateSuperAdminDto {
  username?: string;
  email?: string;
  password?: string;

  constructor(data: Partial<UpdateSuperAdminDto> = {}) {
    Object.assign(this, data);
  }
}

const createSuperAdminSchema = Joi.object<CreateSuperAdminDto>({
  username: Joi.string().trim().min(3).max(80).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(6).max(255).required(),
});

const updateSuperAdminSchema = Joi.object<UpdateSuperAdminDto>({
  username: Joi.string().trim().min(3).max(80),
  email: Joi.string().trim().email(),
  password: Joi.string().trim().min(6).max(255),
}).min(1);

export {
  CreateSuperAdminDto,
  UpdateSuperAdminDto,
  createSuperAdminSchema,
  updateSuperAdminSchema,
};
