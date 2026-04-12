import { Adminstration } from "@admin/model/adminstration";
import { SuperVisor } from "@admin/model/supervisor.model";
import { Worker } from "@admin/model/workers";
import {
  BadRequestError,
  IAdmin,
  NotFoundError,
} from "@panjasaibal/backend_ulb_shared";
import { isValidObjectId, Types } from "mongoose";

interface CreateAdminInput {
  email: string;
  name: string;
  phoneNumber?: string;
}

type OAuthAdmin = IAdmin & {
  profileComplete?: boolean;
  access?: boolean;
  status?: string | boolean;
  subscription?: unknown;
  phoneNumber?: string;
};

type AdminDocShape = {
  _id: Types.ObjectId;
  phoneNumber?: string;
  profileComplete?: boolean;
  access?: boolean;
  status?: string | boolean;
  subscription?: unknown;
  [key: string]: unknown;
};

type AdminSubscriptionStatus = {
  _id: string;
  name: string;
  email: string;
  access: boolean;
  status?: string | boolean;
  subscription?: unknown;
};

function toAdminResponse(admin: AdminDocShape): OAuthAdmin {
  return {
    ...(admin as Record<string, unknown>),
    _id: admin._id.toString(),
    superadmin: "",
    phoneNumber: admin.phoneNumber ?? "",
    profileComplete: Boolean(admin.profileComplete),
    access: admin.access ?? true,
    status: admin.status,
    subscription: admin.subscription,
  } as OAuthAdmin;
}

function ensureValidAdminId(id: string) {
  if (!isValidObjectId(id)) {
    throw new BadRequestError(
      "Invalid admin id",
      "admin oauth service ensureValidAdminId()",
    );
  }
}

export async function createAdmin(admin: CreateAdminInput): Promise<OAuthAdmin> {
  const email = admin.email.trim().toLowerCase();
  const name = admin.name.trim();

  const existingAdmin = await Adminstration.findOne({ email });
  if (existingAdmin) {
    throw new BadRequestError(
      "Admin already exists",
      "admin oauth service createAdmin()",
    );
  }

  const newAdmin = await Adminstration.create({
    email,
    name,
    phoneNumber: admin.phoneNumber ?? "",
    access: true,
    status: "ACTIVE",
  });

  return toAdminResponse(newAdmin.toObject() as AdminDocShape);
}

export async function findAdminById(id: string): Promise<OAuthAdmin> {
  ensureValidAdminId(id);

  const admin = await Adminstration.findById(id);
  if (!admin) {
    throw new NotFoundError(
      "admin does not exists!",
      "admin service findadminById() method",
    );
  }

  return toAdminResponse(admin.toObject() as AdminDocShape);
}

export async function getAdminByEmail(
  email: string,
): Promise<OAuthAdmin | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const admin = await Adminstration.findOne({ email: normalizedEmail }).lean();

  if (!admin) {
    return null;
  }

  return toAdminResponse(admin as AdminDocShape);
}

export async function updateAdmin(
  email: string,
  body: Partial<Pick<OAuthAdmin, "phoneNumber" | "status" | "access">>,
): Promise<OAuthAdmin> {
  const normalizedEmail = email.trim().toLowerCase();
  const admin = await Adminstration.findOne({ email: normalizedEmail });
  if (!admin) {
    throw new NotFoundError(
      "Admin does not exists",
      "admin oauth service updateAdmin() method",
    );
  }

  const adminBody: Record<string, unknown> = {};
  if (typeof body.phoneNumber === "string") {
    adminBody.phoneNumber = body.phoneNumber;
  }
  if (typeof body.status !== "undefined") {
    adminBody.status = body.status;
  }
  if (typeof body.access === "boolean") {
    adminBody.access = body.access;
  }

  adminBody.updatedAt = new Date();

  const updatedAdmin = await Adminstration.findOneAndUpdate(
    { email: normalizedEmail },
    { $set: adminBody },
    { new: true },
  );

  return toAdminResponse(updatedAdmin!.toObject() as AdminDocShape);
}

export async function revokeAdminAccessById(
  id: string,
): Promise<OAuthAdmin> {
  ensureValidAdminId(id);

  const updatedAdmin = await Adminstration.findByIdAndUpdate(
    id,
    {
      $set: {
        access: false,
        status: "REVOKED",
        updatedAt: new Date(),
      },
    },
    { new: true },
  );

  if (!updatedAdmin) {
    throw new NotFoundError(
      "Admin does not exists",
      "admin oauth service revokeAdminAccessById() method",
    );
  }

  return toAdminResponse(updatedAdmin.toObject() as AdminDocShape);
}

export async function deleteAdminById(id: string): Promise<OAuthAdmin> {
  ensureValidAdminId(id);

  const admin = await Adminstration.findById(id);
  if (!admin) {
    throw new NotFoundError(
      "Admin does not exists",
      "admin oauth service deleteAdminById() method",
    );
  }

  await Worker.deleteMany({ admin: admin._id });
  await SuperVisor.deleteMany({ admin: admin._id });
  await Adminstration.findByIdAndDelete(admin._id);

  return toAdminResponse(admin.toObject() as AdminDocShape);
}

export async function getAdminSubscriptionStatusById(
  id: string,
): Promise<AdminSubscriptionStatus> {
  ensureValidAdminId(id);

  const admin = await Adminstration.findById(id).lean();
  if (!admin) {
    throw new NotFoundError(
      "Admin does not exists",
      "admin oauth service getAdminSubscriptionStatusById() method",
    );
  }

  return {
    _id: admin._id.toString(),
    name: String(admin.name),
    email: String(admin.email),
    access: Boolean(admin.access ?? true),
    status: admin.status as string | boolean | undefined,
    subscription: admin.subscription,
  };
}
