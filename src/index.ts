import { createApp } from "./app";
import { Application } from 'express';
import { connectToMoongoose } from "@admin/db";
import { startServer } from "./server";
import http from 'http';
import { config } from "./config";

let server:http.Server;

const initialize = ():void=>{
  
  connectToMoongoose();
  config.configCloudinary();
  const app:Application = createApp();
  server = startServer(app);
}

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION 💥", err);
  process.exit(1);
});

initialize();

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION 💥", err);
  if(server){
    server.close(()=> process.exit(1));
  }else{
    process.exit(1);
  }
});




