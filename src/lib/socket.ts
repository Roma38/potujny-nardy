import { io, Socket } from "socket.io-client";
import { APP_ORIGIN } from "./constants";

const socket: Socket = io(APP_ORIGIN, {
  path: "/api/socket",
  autoConnect: false,
  transports: ["websocket", "polling"],
  upgrade: true,
  timeout: 20000,

  reconnection: true,
  reconnectionAttempts: 18, // About 18 attempts in 3 minutes
  reconnectionDelay: 2000, // Start with 2 seconds
  reconnectionDelayMax: 15000, // Max 15 seconds between attempts
  randomizationFactor: 0.3,
});

// Debugging
socket.on("connect", () => {
  console.log("✅ Connected to server:", socket.id);
  console.log("🚀 Transport:", socket.io.engine.transport.name);
});

socket.on("connect_error", (error) => {
  console.error("❌ Connection failed:", error.message);
  console.error("❌ Error details:", error);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Disconnected:", reason);
});

socket.on("reconnect", (attemptNumber) => {
  console.log("🔄 Reconnected after", attemptNumber, "attempts");
});

socket.on("reconnect_attempt", (attemptNumber) => {
  console.log("🔄 Reconnection attempt #", attemptNumber);
});

socket.on("reconnect_error", (error) => {
  console.log("❌ Reconnection error:", error);
});

socket.on("reconnect_failed", () => {
  console.log("💀 Reconnection failed - giving up");
});
//

async function initializeSocketServer() {
  try {
    await fetch(`${APP_ORIGIN}/api/socket`);
    console.log("✅ Socket.IO server initialized");
  } catch (error) {
    console.error("❌ Failed to initialize server:", error);
  }
}

// Call this before connecting
export async function connectSocket() {
  await initializeSocketServer();
  socket.connect();
}

export default socket;
