import express, { Application, Express, json,Request, Response, NextFunction } from "express";
import hpp from "hpp";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import { appRoutes } from "@admin/route";
import { passport } from "./passport";
import { CustomError, IErrorResponse } from "@panjasaibal/backend_ulb_shared";


export function createApp():Application{
  const app: Express = express();
  securityMiddleWare(app);
  standardMiddleware(app);
  routeMiddleware(app);

 // errorLogger(app);

 return app;
}

function securityMiddleWare(app: Application) {
  app.set("trust proxy", 1);
  app.use(hpp());
  app.use(helmet({}));

  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    }),
  );

  app.use(cookieParser())
  app.use(passport.initialize());


}

function standardMiddleware(app: Application) {
  app.use(compression());
  app.use(json({ limit: "200mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));
}

function routeMiddleware(app: Application): void {
  appRoutes(app);
}

// app.use("/api/super", require("./routers/superAdmin.route"));
// app.use("/api/admin", require("./routers/admin.router"));
// app.use("/api/supervisor", require("./routers/superVisor.routes"));
// app.use("/api/worker", require("./routers/workerkormi"));
// app.use("/api/track", require("./routers/trackeRoutes"));





function errorLogger(app: Application) {
  app.use('*', (req: Request, res: Response, next: NextFunction) => {
      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      //log.log('error', `${fullUrl} endpoint does not exist.`, '');
      console.error(`${fullUrl} endpoint does not exist.`);
      res.status(404).json({ message: 'The endpoint called does not exist.'});
      next();
    });

  app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
      if (error instanceof CustomError) {
        //log.log('error', `GatewayService ${error.comingFrom}:`, error);
        res.status(error.statusCode).json(error.serializeErrors());
      }
      next();
    });
}

