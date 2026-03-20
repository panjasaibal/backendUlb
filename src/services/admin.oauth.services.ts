import { Adminstration } from "@admin/model/adminstration";
import { SuperAdmin } from "@admin/model/superadmin.model";
import { BadRequestError, IAdmin } from "@panjasaibal/backend_ulb_shared";
import { isValidObjectId, Types } from "mongoose";

interface GoogleProfile {
  emails?: Array<{ value: string }>;
  displayName?: string;
}

type OAuthAdmin = IAdmin & {
  profileComplete?: boolean;
  access?: boolean;
  status?: string | boolean;
  subscription?: unknown;
  phoneNumber?: string;
};

function toAdminResponse(admin: {
  _id: Types.ObjectId;
  superadmin?: Types.ObjectId | string;
  phoneNumber?: string;
  profileComplete?: boolean;
  access?: boolean;
  status?: string | boolean;
  subscription?: unknown;
  [key: string]: unknown;
}): OAuthAdmin {
  return {
    ...(admin as Record<string, unknown>),
    _id: admin._id.toString(),
    superadmin: admin.superadmin?.toString() ?? "",
    phoneNumber: admin.phoneNumber ?? "",
    profileComplete: Boolean(admin.profileComplete)
  } as OAuthAdmin;
}

export async function createAdmin(
  profile: GoogleProfile | undefined,
  superAdminId: string
): Promise<OAuthAdmin> {
  const email = profile?.emails?.[0]?.value?.trim().toLowerCase();
  const name = profile?.displayName?.trim();

  if (!email || !name) {
    throw new BadRequestError(
      "Incomplete Google profile",
      "admin oauth service createAdmin()"
    );
  }

  if (!isValidObjectId(superAdminId)) {
    throw new BadRequestError(
      "Invalid superadmin id",
      "admin oauth service createAdmin()"
    );
  }

  const existingAdmin = await Adminstration.findOne({ email });
  if (existingAdmin) {
    throw new BadRequestError(
      "Admin already exists",
      "admin oauth service createAdmin()"
    );
  }

  const superAdmin = await SuperAdmin.findById(superAdminId);
  if (!superAdmin) {
    throw new BadRequestError(
      "SuperAdmin not found",
      "admin oauth service createAdmin()"
    );
  }

  const newAdmin = await Adminstration.create({
    email,
    name,
    superadmin: new Types.ObjectId(superAdminId),
    status: "PENDING"
  });

  const adminObject = newAdmin.toObject();

  return toAdminResponse(adminObject);
}

export async function getAdminByEmail(
  email: string
): Promise<OAuthAdmin | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const admin = await Adminstration.findOne({ email: normalizedEmail }).lean();

  if (!admin) {
    return null;
  }

  return toAdminResponse(admin as Parameters<typeof toAdminResponse>[0]);
}
