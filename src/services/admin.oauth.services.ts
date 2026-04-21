import { prisma } from "@admin/prisma";
import { signAccessToken, signCustomAccessToken, signRefreshToken, verifyRefreshToken } from "@admin/util/jwt_manage";
import { BadRequestError, IAdmin, NotAuthorizedError, NotFoundError } from "@panjasaibal/backend_ulb_shared";
import { SignOptions } from "jsonwebtoken";
import { Request } from 'express';


const DEFAULT_PROVIDER = "google";

interface AdminBody{
  email:string,
  name: string
}

interface RefreshSessionInput {
  refreshToken?: string | null;
  accessTokenExpiresIn?: SignOptions["expiresIn"];
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  provider?: string;
  status?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminAuthResult {
  user: AdminProfile;
  accessToken: string;
  refreshToken: string;
}

function toAdminProfile(record: {
  id: string;
  name: string;
  email: string;
  provider?: string;
  phoneNumber?: string;
  access?: boolean;
  profileComplete?: boolean;
  status?: string
  createdAt: Date;
  updatedAt: Date;
}): AdminProfile {
  return {
    id: record.id,
    name: record.name,
    email: record.email, 
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    phoneNumber: record.phoneNumber?record.phoneNumber: '',
    status: record.status? record.status: 'ACTIVE',
    provider: record.provider? record.provider: DEFAULT_PROVIDER
  };
}

function buildAuthResult(
  user: AdminProfile,
  accessTokenExpiresIn: SignOptions["expiresIn"] = "15m",
): AdminAuthResult {
  return {
    user,
    accessToken:
      accessTokenExpiresIn === "15m"
        ? signAccessToken(user.id, user.name, user.email)
        : signCustomAccessToken(
            user.id,
            user.name,
            user.email,
            "ADMIN",
            accessTokenExpiresIn
          ),
    refreshToken: signRefreshToken(
      user.id,
      user.name,
      user.email,
    ),
  };
}

export async function createAdmin(payload:AdminBody):Promise<AdminAuthResult> {
  
  const existedAdmin = await prisma.admin.findUnique({
    where:{email: payload.email},
    select:{id: true}
  });

  if(existedAdmin){
    throw new BadRequestError("Admin already exists","coming from admin service createAdmin()");
  }

  const newAdmin = await prisma.admin.create({
    data:{
      email:payload.email,
      name: payload.name
    },
    select:{
      id:true,
      name:true,
      email: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return buildAuthResult(newAdmin);
}



export async function findAdminById(id: string): Promise<AdminProfile> {
  const admin = await prisma.admin.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!admin) {
    throw new NotFoundError(
      "admin does not exists!",
      "admin service findAdminById() method",
    );
  }

  return toAdminProfile(admin);
}

export async function findAdminByEmail(
  email: string,
): Promise<AdminProfile | null> {
  const admin = await prisma.admin.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return admin ? toAdminProfile(admin) : null;
}

export async function restoreAdminSession(
  input: RefreshSessionInput,
): Promise<AdminAuthResult> {
  const refreshToken = input.refreshToken?.trim();

  if (!refreshToken) {
    throw new NotAuthorizedError(
      "Refresh token is required",
      "admin service restoreAdminSession() method",
    );
  }

  const decoded = verifyRefreshToken(refreshToken);
  if (decoded.role !== "ADMIN") {
    throw new NotAuthorizedError(
      "Invalid refresh token role",
      "admin service restoreAdminSession() method",
    );
  }

  const admin = await findAdminById(decoded.id);
  return buildAuthResult(admin, input.accessTokenExpiresIn ?? "15m");
}



