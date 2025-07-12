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
import { Room } from "@/lib/types";

export default function GameRoom() {
  const [roomUsers, setRoomUsers] = useState <string[]>([]);
  const { state, onPointClick, rollDice, bearOff, resetState } = useGame();
  const { roomId } = useParams()!;
  
  useEffect(() => {
    socket.emit("get room", roomId, (room: Room) => {
      console.log({ room });
      setRoomUsers(room.visitors);
      resetState(room.state);
    });

    socket.on("room update", (room) => {
      setRoomUsers(room);
    })
    
    return () => {
      socket.off();
    };
  }, [])

  const [white, black, ...visitors] = roomUsers;
  const playerColor = white === socket.id ? 'white' 
    : black === socket.id ? 'black' : null;
  const isUsersTurn = playerColor === state.currentPlayer;
  console.log({ playerColor, isUsersTurn, visitors })
  return (
    <div className={`grow ${isUsersTurn ? "" : "pointer-events-none"}`}>
      <div className="flex justify-between w-full">
        <Score player="white" score={state.score} />

        <div className="grow">
          <h2 className="text-xl font-bold capitalize text-center">{state.currentPlayer}</h2>
          <Bar bar={state.bar} />
          <BorneOff borneOff={state.borneOff} bearOff={bearOff} />
        </div>

        <Score player="black" score={state.score} />
      </div>

      <Board
        board={state.board}
        selectedPoint={state.selectedPoint}
        onPointClick={onPointClick}
      />

      <Dice dice={state.dice} onRoll={rollDice} />
    </div>
  );
}
