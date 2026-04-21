import { createApp } from "./app";
import { Application } from "express";
import { connectToMoongoose } from "@admin/db";
import { startServer } from "./server";
import http from "http";
import { config } from "./config";
import { prismaConnection } from "./prisma";

let server: http.Server;

const initialize = async (): Promise<void> => {
  await connectToMoongoose();
  await prismaConnection.connect().then(()=>console.log("prisma connected with database"));
  config.configCloudinary();
  const app: Application = createApp();
  server = startServer(app);
};

process.on("uncaughtException", (err) => {
  prismaConnection.disconnect().then(()=>console.log("prisma connection terminated"));
  console.error("UNCAUGHT EXCEPTION", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  prismaConnection.disconnect().then(()=>console.log("prisma connection terminated"));
  console.error("UNHANDLED REJECTION", err);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

initialize().catch((err) => {
  prismaConnection.disconnect().then(()=>console.log("prisma connection terminated"));
  console.error("APPLICATION STARTUP FAILED", err);
  process.exit(1);
});
