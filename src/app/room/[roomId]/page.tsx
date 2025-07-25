"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Board from "@/components/Board";
import Dice from "@/components/Dice";
import Bar from "@/components/Bar";
import BorneOff from "@/components/BorneOff";
import Score from "@/components/Score";
import Notifications from "@/components/Notifications";
import Modal from "@/components/Modal";
import { useGame } from "@/hooks/useGame";
import { useNotifications } from "@/hooks/useNotifications";
import socket, { connectSocket } from "@/lib/socket";
import { TRoom, TRoomState } from "@/lib/types";
import { emitEndTurn } from "@/hooks/gameActions";

export default function GameRoom() {
  const [roomUsers, setRoomUsers] = useState <string[]>([]);
  const { state, onPointClick, rollDice, bearOff, updateState, setDice, isHaveValidMoves } = useGame();
  const { notifications, visitorsUpdateNote, pushNote } = useNotifications();
  const { roomId }: { roomId: string } = useParams()!;
  const modalRef = useRef<HTMLDialogElement>(null);
  const [modalText, setModalText] = useState(""); 

  useEffect(() => {
    if (!socket.connected) {
      connectSocket();
    } else {
      joinRoom();
    }

    socket.on("room update", (room) => {
      setRoomUsers(prevRoomUsers => {
        visitorsUpdateNote(prevRoomUsers, room);
        return room;
      });
    });
    socket.on("dice update", (dice: TRoomState["dice"]) => setDice(dice));
    socket.on("state updated", state => updateState({ ...state, selectedPoint: null }));
    socket.on("disconnect", () => pushNote("❌ Connection lost"));
    socket.on("reconnect_attempt", () => pushNote("Reconnecting..."));
    socket.on("reconnect", () => {
      pushNote("✅ Connection restored");
      joinRoom();
    });
    socket.on("connect", () => {
      pushNote("✅ Connected");
      joinRoom();
    });

    return () => {
      socket.off();
      socket.emit("leave", roomId);
      console.log(`Left room ${roomId}`);
    };
  }, []);

  useEffect(() => {
    if (state.dice.length && !isHaveValidMoves()) {
      if (isUsersTurn) {
        setModalText(`You have no moves: ${state.dice.toString()}`);
        modalRef.current?.addEventListener("close", () => emitEndTurn(state, roomId), { once: true });
        modalRef.current?.showModal();
      } else {
        pushNote(`${state.currentPlayer} has no moves: ${state.dice.toString()}`)
      }
    }
  }, [state.board, state.dice]);

  function joinRoom() {
    console.log("Join room ", roomId)
    socket.emit("join", roomId, (room: TRoom) => {
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
    <div className={`scale-70 sm:scale-none grow ${isUsersTurn ? "" : "pointer-events-none"}`}>
      <div className="flex justify-between w-full items-center">
        <Score 
          player="white" 
          score={state.score} 
          isUsersTurn={state.currentPlayer === "white"}
          isPlayerConnected={Boolean(white)}
        />

        <div className="grow">
          <h2 className="text-xl font-bold capitalize text-center">
            {isUsersTurn ? "Your move" : `${state.currentPlayer}'s move`}
          </h2>
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
      >
        <Bar bar={state.bar} selectedPoint={state.selectedPoint} />
      </Board>

      <Dice dice={state.dice} onRoll={() => rollDice(roomId)} isUsersTurn={isUsersTurn} />
      <Modal ref={modalRef}>{modalText}</Modal>
      <Notifications notifications={notifications} />
    </div>
  );
}
