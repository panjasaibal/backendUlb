import { AdminDto } from "@admin/dto/admin.dto";
import { prisma } from "@admin/prisma";
import { signAccessToken, signCustomAccessToken, signRefreshToken, verifyRefreshToken } from "@admin/util/jwt_manage";
import { BadRequestError, IAdmin, NotAuthorizedError, NotFoundError } from "@panjasaibal/backend_ulb_shared";
import { AdminStatus, AdminProvider } from "@prisma/client";
import { SignOptions } from "jsonwebtoken";


interface RefreshSessionInput {
  refreshToken?: string | null;
  accessTokenExpiresIn?: SignOptions["expiresIn"];
}


interface AdminAuthResult{
  user: AdminDto,
  accessToken: string,
  refreshToken: string
}


function toAdminDto(record: {
  id: string;
  name: string;
  email: string;
  provider: AdminProvider;
  phoneNumber?: string;
  access: boolean;
  profileComplete: boolean;
  status: AdminStatus;
  createdAt?: Date;
  updatedAt?: Date;
}): AdminDto {
  return {
    id: record.id,
    name: record.name,
    email: record.email, 
    createdAt: record.createdAt!,
    updatedAt: record.updatedAt!,
    phoneNumber: record.phoneNumber?record.phoneNumber: '',
    status: record.status,
    provider: record.provider
  };
}

function buildAuthResult(
  user: AdminDto,
  accessTokenExpiresIn: SignOptions["expiresIn"] = "15m",
): AdminAuthResult {
  return {
    user,
    accessToken:
      accessTokenExpiresIn === "15m"
        ? signAccessToken(user.id!, user.name, user.email)
        : signCustomAccessToken(
            user.id!,
            user.name,
            user.email,
            "ADMIN",
            accessTokenExpiresIn
          ),
    refreshToken: signRefreshToken(
      user.id!,
      user.name,
      user.email,
    ),
  };
}

export async function createAdmin(payload:AdminDto):Promise<AdminAuthResult> {
  
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
      provider: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return buildAuthResult(newAdmin,"1d");
}



export async function findAdminById(id: string): Promise<AdminDto> {
  const admin = await prisma.admin.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      provider: true,
      access: true,
      profileComplete: true
      
    },
  });

  if (!admin) {
    throw new NotFoundError(
      "admin does not exists!",
      "admin service findAdminById() method",
    );
  }

  return toAdminDto(admin);
}

export async function findAdminByEmail(
  email: string,
): Promise<AdminDto> {
  const admin = await prisma.admin.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      provider: true,
      profileComplete: true,
      access: true,
    },
  });
  if(!admin){
    throw new NotFoundError("Admin does not exists", "Admin service findAdminByEmail()");
  }

  return toAdminDto(admin);
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



