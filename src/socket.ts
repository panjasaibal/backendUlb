import http from "http";
import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import { config } from "@admin/config";
import { createTracker } from "@admin/services/tracker.service";


export async function initializeSocket(httpServer: http.Server) {
  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  const pubClient = createClient({ url: `${config.REDIS_URL!}` });
  const subClient = pubClient.duplicate();

  await pubClient.connect();
  await subClient.connect();

  io.adapter(createAdapter(pubClient, subClient));

  io.on("connection", (socket) => {
    console.log("Socket connected :", socket.id);

    socket.on("admin-join", (adminId: string) => {
      socket.join(`admin-${adminId}`);
      console.log(`admin joined: admin-${adminId}`);
    });

    socket.on("worker-location", async (data) => {
      createTracker({
        latitude: data.latitude,
        longitude: data.longitude,
        role: data.role,
        user_id: data.userId,
      });

      io.to(`admin-${data.adminId}`).emit("location-update", {
        //sends to admin
        latitude: data.latitude,
        longitude: data.longitude,
        role: data.role,
        user_id: data.userId,
      });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });
  });
}
