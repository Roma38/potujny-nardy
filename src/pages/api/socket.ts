import { Server as ServerIO } from "socket.io";
import type { NextApiRequest } from "next";
import type { Server as HTTPServer } from "http";
import type { Socket } from "socket.io";
import type { Server as IOServer } from "socket.io";
import type { NextApiResponse } from "next";
import { rooms } from "./dataBase";

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
        let room = rooms[roomId];
        if (!room) {
          rooms[roomId] = []; // create room
          room = rooms[roomId];
        };  

        if (!room[0]) {
          room[0] = socket.id; // set first player
        } else if (!room[1]) {
          room[1] = socket.id;  // set second player
        } else {
          room.push(socket.id); // set visitor
        };
        console.log(rooms);
        console.log(`Socket ${socket.id} joined ${roomId}`);
        io.to(roomId).emit("room update", room);
      });

      socket.on("get room", (roomId: string, callback) => {
        const room = rooms[roomId] || [];
        callback(room);
      });

      socket.on("disconnect", () => {
        Object.entries(rooms).forEach(([roomId, room]) => {
          const index = room.indexOf(socket.id);
          
          if (index !== -1) {
            delete room[index];
            console.log(`Socket ${socket.id} left ${roomId}`);
            io.to(roomId).emit("room update", room);
          };
        })
        console.log("❌ Socket disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
    console.log("✅ Socket.io server initialized");
  }

  res.end();
}
