import Joi from "joi";

class SignUpSuperAdminDto {
  username = "";
  email = "";
  password = "";

  constructor(data: Partial<SignUpSuperAdminDto> = {}) {
    Object.assign(this, data);
  }
}

class SignInSuperAdminDto {
  email = "";
  password = "";

  constructor(data: Partial<SignInSuperAdminDto> = {}) {
    Object.assign(this, data);
  }
}

const signUpSuperAdminSchema = Joi.object<SignUpSuperAdminDto>({
  username: Joi.string().trim().min(3).max(80).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(6).max(255).required(),
});

const signInSuperAdminSchema = Joi.object<SignInSuperAdminDto>({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(6).max(255).required(),
});

export {
  SignUpSuperAdminDto,
  SignInSuperAdminDto,
  signUpSuperAdminSchema,
  signInSuperAdminSchema,
};
