"use client";

import { redirect } from 'next/navigation'
import { useEffect } from "react";
import socket, { joinRoom } from "@/lib/socket";

export default function Page() {
  useEffect(() => {
    const roomId = "room-123";
    joinRoom(roomId);

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("joined", (roomId) => {
      console.log("🧑‍🤝‍🧑", `Player joined /${roomId}`); // "Player joined room-123"
      redirect(`/room/${roomId}`);
    });

    return () => {
      socket.off();
    };
  }, []);

  return <div className="text-white grow">Joined game room</div>;
}
