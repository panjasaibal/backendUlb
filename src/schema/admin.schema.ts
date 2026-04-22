import Joi from "joi";
import { AdminDto } from "@admin/dto/admin.dto";


const createAdminSchema = Joi.object<AdminDto>({
  name: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().trim().email().required(),
  provider: Joi.string().valid("google", "credentials").default("google"),
  phoneNumber: Joi.string().trim().max(20).allow(null, ""),
  access: Joi.boolean().default(true),
  profileComplete: Joi.boolean().default(false),
  status: Joi.string().valid("PENDING", "ACTIVE", "DISABLED").default("ACTIVE"),
  subscription: Joi.string().valid("FREE", "BASIC", "PREMIUM").default("FREE"),
});

const updateAdminSchema = Joi.object<AdminDto>({
  name: Joi.string().trim().min(2).max(120),
  phoneNumber: Joi.string().trim().max(20).allow(null, ""),
  access: Joi.boolean(),
  profileComplete: Joi.boolean(),
  status: Joi.string().valid("PENDING", "ACTIVE", "DISABLED"),
  subscription: Joi.string().valid("FREE", "BASIC", "PREMIUM"),
}).min(1);


export {
  createAdminSchema,
  updateAdminSchema,
};
