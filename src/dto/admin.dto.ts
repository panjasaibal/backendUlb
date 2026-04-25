import { AdminProvider, AdminStatus, SubscriptionPlan } from "@prisma/client";
import Joi from "joi";

// export enum AdminProvider {
//   GOOGLE = 'google',
//   // add other providers as needed
// }

// export enum AdminStatus {
//   ACTIVE = 'ACTIVE',
//   INACTIVE = 'INACTIVE',
//   DISABLED = "DISABLED"
//   // add other statuses as needed
// }


// export enum SubscriptionPlan {
//   FREE = 'FREE',
//   PRO = 'PRO',
//   // add other plans as needed
// }

interface AdminDto {
  id?: string;
  name: string;
  email: string;
  provider?: AdminProvider;
  phoneNumber?: string;
  access?: boolean;
  profileComplete?: boolean;
  status?: AdminStatus;
  subscription?: SubscriptionPlan;
  createdAt?: Date,
  updatedAt?: Date,
}

export{
  AdminDto
}
