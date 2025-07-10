import { Server as ServerIO } from "socket.io";
import type { NextApiRequest } from "next";
import type { Server as HTTPServer } from "http";
import type { Socket } from "socket.io";
import type { Server as IOServer } from "socket.io";
import type { NextApiResponse } from "next";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: HTTPServer & {
      io: IOServer;
    };
  };
};

export type SocketWithUser = Socket & {
  userId?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket.server.io) {
    const io = new ServerIO(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("🔌 New socket connected:", socket.id);

      socket.on("message", (msg) => {
        console.log("💬 message received:", msg);
        io.emit("message", msg);
      });

      socket.on("join", (roomId: string) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined ${roomId}`);
        io.to(roomId).emit("joined", roomId);
      });

      socket.on("disconnect", () => {
        console.log("❌ Socket disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
    console.log("✅ Socket.io server initialized");
  }

  res.end();
}
