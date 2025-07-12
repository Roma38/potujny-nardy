"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";
import { DEFAULT_ROOM_ID } from '@/lib/constants';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
      socket.once("connect", () => {
        socket.emit("join", DEFAULT_ROOM_ID);
        router.push(`/room/${DEFAULT_ROOM_ID}`);
      });
    } else {
      socket.emit("join", DEFAULT_ROOM_ID);
      router.push(`/room/${DEFAULT_ROOM_ID}`);
    }
    
    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    return () => {
      socket.off();
    };
  }, []);

  return <div className="text-white grow">Joined game room</div>;
}
