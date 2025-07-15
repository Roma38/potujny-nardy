"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";
import { Rooms } from "@/lib/types";
import RoomCard from "@/components/RoomCard";

export default function Page() {
  const router = useRouter();
  const [rooms, setRooms] = useState <Rooms>({});

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
      socket.once("connect", () => {
        console.log("✅ Connected:", socket.id);
        socket.emit("get rooms", (rooms: Rooms) => setRooms(rooms));
      });
    } else {
      socket.emit("get rooms", (rooms: Rooms) => setRooms(rooms));
    }

    socket.on("rooms update", (rooms: Rooms) => setRooms(rooms));

    return () => {
      socket.off();
    };
  }, []);

  if (!socket.connected) {
    return <div className="text-white grow">Connecting to server...</div>;
  }
  
  return (
    <div className="grow p-4 space-y-4">
      <button
        onClick={() => router.push(`/room/${socket.id}`)}
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
