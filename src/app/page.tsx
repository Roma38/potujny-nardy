"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import socket, { connectSocket } from "@/lib/socket";
import { TRooms } from "@/lib/types";
import RoomCard from "@/components/RoomCard";

export default function Page() {
  const router = useRouter();
  const [rooms, setRooms] = useState <TRooms>({});

  useEffect(() => {
    if (!socket.connected) {
      connectSocket();
      socket.once("connect", () => {
        console.log("✅ Connected:", socket.id);
        socket.emit("get rooms", (rooms: TRooms) => setRooms(rooms));
      });
    } else {
      socket.emit("get rooms", (rooms: TRooms) => setRooms(rooms));
    }

    socket.on("rooms update", (rooms: TRooms) => setRooms(rooms));

    return () => {
      socket.off();
    };
  }, []);

  if (!socket.connected) {
    return <div className="text-white grow">Connecting to server...</div>;
  }
  
  return (
    <div className="grow p-4 space-y-4 text-center">
      <button
        onClick={() => router.push(`/room/${crypto.randomUUID()}`)}
        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black rounded-md transition"
      >
        Create New Room
      </button>

      {Object.entries(rooms).map(([roomId, room]) => (
        <RoomCard key={roomId} roomId={roomId} visitors={room.visitors} />
      ))}
    </div>
  );
}
