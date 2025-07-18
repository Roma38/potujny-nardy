import { Server as ServerIO } from "socket.io";
import type { NextApiRequest } from "next";
import type { Server as HTTPServer } from "http";
import type { Socket } from "socket.io";
import type { Server as IOServer } from "socket.io";
import type { NextApiResponse } from "next";
import { rooms } from "./dataBase";
import { initialState } from "@/lib/initialState";
import { Rooms, RoomState } from "@/lib/types";
import { APP_ORIGIN } from "@/lib/constants";

function leaveRoom(socket: Socket, roomId: string, rooms: Rooms, io: ServerIO) {
  socket.leave(roomId);

  const room = rooms[roomId];
  if (!room) return;
  const { visitors } = room;
  const index = visitors.indexOf(socket.id);

  if (index !== -1) {
    delete visitors[index];
    console.log(`Socket ${socket.id} left ${roomId}`);
    // if room is empty
    if (visitors.every(item => !item)) {
      console.log(`Room ${roomId} was deleted`)
      delete rooms[roomId];
    }
  
    io.to(roomId).emit("room update", room.visitors);
  }
}

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
        origin: APP_ORIGIN,
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("🔌 New socket connected:", socket.id);

      socket.on("message", (msg) => {
        console.log("💬 message received:", msg);
        io.emit("message", msg);
      });

      socket.on("join", (roomId: string, callback) => {
        let room = rooms[roomId];
        if (!room) {
          rooms[roomId] = {visitors: [], state: initialState}; // create room
          room = rooms[roomId];
          console.log(`Room ${roomId} created`);
        };
        
        if (room.visitors.includes(socket.id)) {
          return console.error(`Socket ${socket.id} tried to join the room ${roomId} which he is already in`)
        }

        if (!room.visitors[0]) {
          room.visitors[0] = socket.id; // set first player
        } else if (!room.visitors[1]) {
          room.visitors[1] = socket.id; // set second player
        } else {
          room.visitors.push(socket.id); // set visitor
        };
        
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined ${roomId}`);
        socket.to(roomId).emit("room update", room.visitors);
        io.emit("rooms update", rooms);
        callback(room);
      });

      // socket.on("get room", (roomId: string, callback) => {
      //   const room = rooms[roomId] || [];
      //   callback(room);
      // });

      socket.on("get rooms", callback => callback(rooms));

      socket.on("roll dice", (roomId) => {
        const d1 = Math.ceil(Math.random() * 6);
        const d2 = Math.ceil(Math.random() * 6);
        const dice: RoomState["dice"] = d1 === d2 ? [d1, d1, d1, d1] : [d1, d2];

        rooms[roomId].state.dice = dice;
        io.to(roomId).emit("dice update", dice);
      });

      socket.on("update state", (state: Partial<RoomState>, roomId: string) => {
        rooms[roomId].state = { ...rooms[roomId].state, ...state };

        io.to(roomId).emit("state updated", rooms[roomId].state);
      });

      socket.on("leave", (roomId: string) => {
        leaveRoom(socket, roomId, rooms, io);
        io.emit("rooms update", rooms);
      });

      socket.on("disconnect", () => {
        Object.keys(rooms).forEach(roomId => {
          leaveRoom(socket, roomId, rooms, io);
        })

        io.emit("rooms update", rooms);
        console.log("❌ Socket disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
    console.log("✅ Socket.io server initialized");
  }

  res.end();
}
