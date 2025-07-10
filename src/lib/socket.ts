import { io, Socket } from "socket.io-client";

const socket: Socket = io({
  path: "/api/socket",
  autoConnect: false,
});

export function joinRoom(roomId: string) {
  if (!socket.connected) {
    socket.connect();

    socket.once("connect", () => {
      console.log("📡 Connected, now joining:", roomId);
      socket.emit("join", roomId);
    });
  } else {
    socket.emit("join", roomId);
  }
}

export default socket;
