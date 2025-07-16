"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Board from "@/components/Board";
import Dice from "@/components/Dice";
import Bar from "@/components/Bar";
import BorneOff from "@/components/BorneOff";
import Score from "@/components/Score";
import { useGame } from "@/hooks/useGame";
import socket from "@/lib/socket";
import { Room, RoomState } from "@/lib/types";

export default function GameRoom() {
  const [roomUsers, setRoomUsers] = useState <string[]>([]);
  const { state, onPointClick, rollDice, bearOff, updateState, setDice } = useGame();
  const { roomId }: { roomId: string } = useParams()!;
  
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
      socket.once("connect", () => joinRoom());
    } else {
      joinRoom();
    }

    socket.on("room update", (room) => setRoomUsers(room))
    socket.on("dice update", (dice: RoomState["dice"]) => setDice(dice));
    socket.on("state updated", state => updateState({ ...state, selectedPoint: null }));
    socket.on("disconnect", reason => console.error("❌ Disconnected from server:", reason));
    socket.on("reconnect_attempt", () => console.log("🔄 trying to reconnect..."));
    socket.on("reconnect", (attempt) => {
      console.log("🔁 reconnected after", attempt, "tries");
    });

    return () => {
      socket.off();
      socket.emit("leave", roomId);
    };
  }, [])

  function joinRoom() {
    socket.emit("join", roomId, (room: Room) => {
      setRoomUsers(room.visitors);
      updateState({ ...room.state, selectedPoint: null });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [white, black, ...spectators] = roomUsers;
  const playerColor = white === socket.id ? 'white' 
    : black === socket.id ? 'black' : null;
  const isUsersTurn = playerColor === state.currentPlayer;
  
  return (
    <div className={`grow ${isUsersTurn ? "" : "pointer-events-none"}`}>
      <div className="flex justify-between w-full items-center">
        <Score 
          player="white" 
          score={state.score} 
          isUsersTurn={state.currentPlayer === "white"}
          isPlayerConnected={Boolean(white)}
        />

        <div className="grow">
          <h2 className="text-xl font-bold capitalize text-center">{state.currentPlayer}</h2>
          <Bar bar={state.bar} />
          <BorneOff borneOff={state.borneOff} bearOff={bearOff} />
        </div>

        <Score 
          player="black" 
          score={state.score} 
          isUsersTurn={state.currentPlayer === "black"}
          isPlayerConnected={Boolean(black)}
        />
      </div>

      <Board
        board={state.board}
        selectedPoint={state.selectedPoint}
        onPointClick={onPointClick}
      />

      <Dice dice={state.dice} onRoll={() => rollDice(roomId)} isUsersTurn={isUsersTurn} />
    </div>
  );
}
