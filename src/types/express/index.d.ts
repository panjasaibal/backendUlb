export {};

declare global {
  namespace Express {
    interface User {
      _id?: string;
      id?: string;
      role?: "ADMIN" | "SUPERADMIN";
      superAdminId?: string;
      emails?: Array<{ value: string }>;
      displayName?: string;
    }

    interface Request {
      oAuthState?: string | Record<string, unknown>;
      superadmin_oAuthState?: string | Record<string, unknown>;
    }
  }
}

declare module "express-serve-static-core" {
  interface Request {
    oAuthState?: string | Record<string, unknown>;
    superadmin_oAuthState?: string | Record<string, unknown>;
  }
}
