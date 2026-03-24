export {};

declare global {
  namespace Express {
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
