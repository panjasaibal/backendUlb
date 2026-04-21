import Joi from "joi";
import type { AdminProvider, AdminStatus } from "../model/adminstration";
import type { SubscriptionPlan } from "../model/subscription";

class CreateAdminDto {
  name = "";
  email = "";
  password = "";
  provider: AdminProvider = "google";
  phoneNumber: string | null = null;
  access = true;
  profileComplete = false;
  status: AdminStatus = "ACTIVE";
  subscription: SubscriptionPlan = "FREE";

  constructor(data: Partial<CreateAdminDto> = {}) {
    Object.assign(this, data);
  }
}

class UpdateAdminDto {
  name?: string;
  phoneNumber?: string | null;
  access?: boolean;
  profileComplete?: boolean;
  status?: AdminStatus;
  subscription?: SubscriptionPlan;

  constructor(data: Partial<UpdateAdminDto> = {}) {
    Object.assign(this, data);
  }
}

const createAdminSchema = Joi.object<CreateAdminDto>({
  name: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(6).max(255).required(),
  provider: Joi.string().valid("google", "credentials").default("google"),
  phoneNumber: Joi.string().trim().max(20).allow(null, ""),
  access: Joi.boolean().default(true),
  profileComplete: Joi.boolean().default(false),
  status: Joi.string().valid("PENDING", "ACTIVE", "DISABLED").default("ACTIVE"),
  subscription: Joi.string().valid("FREE", "BASIC", "PREMIUM").default("FREE"),
});

const updateAdminSchema = Joi.object<UpdateAdminDto>({
  name: Joi.string().trim().min(2).max(120),
  phoneNumber: Joi.string().trim().max(20).allow(null, ""),
  access: Joi.boolean(),
  profileComplete: Joi.boolean(),
  status: Joi.string().valid("PENDING", "ACTIVE", "DISABLED"),
  subscription: Joi.string().valid("FREE", "BASIC", "PREMIUM"),
}).min(1);

export {
  CreateAdminDto,
  UpdateAdminDto,
  createAdminSchema,
  updateAdminSchema,
};
