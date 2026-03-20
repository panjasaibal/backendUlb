import { Application } from "express";
import http from 'http';
const PORT = 5000;


export function startServer(app: Application): http.Server {
    const httpServer: http.Server = new http.Server(app);
    httpServer.listen(PORT, () => {
      console.log(`Server started at port:${PORT}`);

      httpServer.on("error", (error: NodeJS.ErrnoException) => {
        if (error.code === "EADDRINUSE") {
          console.error("PORT already in use");
        } else {
          console.error("Server error", error);
        }
        process.exit(1);
      });
    });
    return httpServer;
}