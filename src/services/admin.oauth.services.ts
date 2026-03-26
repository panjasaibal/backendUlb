import { Adminstration } from "@admin/model/adminstration";
import { SuperAdmin } from "@admin/model/superadmin.model";
import {
  BadRequestError,
  IAdmin,
  NotFoundError,
} from "@panjasaibal/backend_ulb_shared";
import { isValidObjectId, Types } from "mongoose";
import jwt from "jsonwebtoken";
import { config } from "@admin/config";

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
  inviteToken?: string;
};

function toAdminResponse(admin: {
  _id: Types.ObjectId;
  superadmin?: Types.ObjectId | string;
  phoneNumber?: string;
  profileComplete?: boolean;
  access?: boolean;
  status?: string | boolean;
  subscription?: unknown;
  inviteToken?: string;
  [key: string]: unknown;
}): OAuthAdmin {
  return {
    ...(admin as Record<string, unknown>),
    _id: admin._id.toString(),
    superadmin: admin.superadmin?.toString() ?? "",
    phoneNumber: admin.phoneNumber ?? "",
    profileComplete: Boolean(admin.profileComplete),
    inviteToken: admin.inviteToken,
  } as OAuthAdmin;
}

export async function createAdmin(admin: IAdmin): Promise<OAuthAdmin> {
  const { email, name, superadmin } = admin;
  if (!isValidObjectId(superadmin)) {
    throw new BadRequestError(
      "Invalid superadmin id",
      "admin oauth service createAdmin()",
    );
  }

  const existingAdmin = await Adminstration.findOne({ email });
  if (existingAdmin) {
    throw new BadRequestError(
      "Admin already exists",
      "admin oauth service createAdmin()",
    );
  }

  const superAdmin = await SuperAdmin.findById(superadmin);
  if (!superAdmin) {
    throw new BadRequestError(
      "SuperAdmin not found",
      "admin oauth service createAdmin()",
    );
  }

  const token = jwt.sign({ email, superadmin }, config.INVITE_SECRET!, {
    expiresIn: "1d",
  });

  const newAdmin = await Adminstration.create({
    email,
    name,
    inviteToken: token,
    inviteExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    superadmin: new Types.ObjectId(superadmin),
    status: "PENDING",
  });

  const adminObject = newAdmin.toObject();

  return toAdminResponse(adminObject);
}

export async function findAdminById(id:string):Promise<IAdmin> {
    const admin = await Adminstration.findById(id);
    if(!admin) throw new NotFoundError("admin does not exists!", "admin service findadminById() method");

    return {
        _id:(admin._id).toString(),
        name: admin.name,
        superadmin: (admin.superadmin).toString(),
        role: admin.role,
        email: admin.email,
        phoneNumber: admin.phoneNumber|| '',
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
    }
}

export async function getAdminByEmail(
  email: string,
): Promise<OAuthAdmin | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const admin = await Adminstration.findOne({ email: normalizedEmail }).lean();

  if (!admin) {
    return null;
  }

  return toAdminResponse(admin as Parameters<typeof toAdminResponse>[0]);
}

export async function findAdminByToken(token: string): Promise<IAdmin| null> {
  try {
    const decoded: any = jwt.verify(token, config.INVITE_SECRET!);

    const admin = await Adminstration.findOne({
      email: decoded.email,
      inviteToken: token,
    });
    if (!admin)
      throw new NotFoundError(
        "Admin does not exists",
        "admin oauth service findAdminByEmailAndToken() method",
      );
    if (admin.superadmin !== decoded.superAdminId)
      throw new BadRequestError(
        "Superadmin does not match",
        "admin oauth service findAdminByEmailAndToken() method",
      );

    return {
      superadmin: admin.superadmin?.toString(),
      name: admin.name,
      email: admin.email,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
      phoneNumber: admin.phoneNumber ? admin.phoneNumber : "",
    } as IAdmin;
  } catch (error) {
    return null;
  }
}

export async function updateAdmin(email: string, body: any): Promise<IAdmin> {
  const admin = await Adminstration.findOne({ email });
  if (!admin)
    throw new NotFoundError(
      "Admin does not exists",
      "admin oauth service updateAdmin() method",
    );
  let adminBody = {} as any;
  if (body.phoneNumber) {
    adminBody.phoneNumber = body.phoneNumber;
  }
  if (body.status) {
    adminBody.status = body.status;
  }

  adminBody.updatedAt = new Date();

  const updatedAdmin = await Adminstration.findOneAndUpdate(
    { email },
    { $set: { adminBody } },
  );

  return {
    superadmin: updatedAdmin!.superadmin?.toString(),
    name: updatedAdmin!.name,
    email: updatedAdmin!.email,
    createdAt: updatedAdmin!.createdAt,
    updatedAt: updatedAdmin!.updatedAt,
    phoneNumber: updatedAdmin!.phoneNumber,
  } as IAdmin;
}
