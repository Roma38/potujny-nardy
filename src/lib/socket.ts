import { GameState } from "@/hooks/gameReducer";
import { io, Socket } from "socket.io-client";
import { Player } from "./types";
import { initialState } from "./initialState";
import { APP_ORIGIN } from "./constants";

const socket: Socket = io(APP_ORIGIN, {
  path: "/api/socket",
  autoConnect: false,
  transports: ["websocket", "polling"],
  upgrade: true,
  timeout: 20000,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  forceNew: true,
  // Add query parameters for debugging
  query: {
    timestamp: Date.now(),
  },
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

socket.on("reconnect_error", (error) => {
  console.error("❌ Reconnection failed:", error);
});
//

function hitBlot(point: number, state: GameState): GameState {
  const blot = state.board[point].pop(); // hit blot
  if (!blot) throw new Error("No checkers in selected point");
  state.bar[blot.color].push(blot); // push blot to bar

  return state;
}

function isOpponentsBlotThere(point: number, state: GameState): boolean {
  const { board, currentPlayer } = state;
  return board[point][0] && board[point][0].color !== currentPlayer
    ? true
    : false;
}

function changeTurn(state: GameState): GameState {
  state.currentPlayer = state.currentPlayer === "white" ? "black" : "white";

  return state;
};

function removeDie(dieIndex: number, state: GameState): GameState {
  state.dice.splice(dieIndex, 1);
  if (!state.dice.length) {
    changeTurn(state);
  }

  return state;
};

export function emitMoveChecker(from: number, to: number, state: GameState, roomId: string) {
  const newState = structuredClone(state);

  if (isOpponentsBlotThere(to, newState)) {
    hitBlot(to, newState);
  }

  newState.board[to].push(newState.board[from].pop()!); // move checker
  const dieIndex = newState.dice.indexOf(Math.abs(from - to));
  removeDie(dieIndex, newState); // remove die
  
  socket.emit("update state", newState, roomId);
}

export function emitReEnterChecker(point: number, state: GameState, roomId: string) {
  const newState = structuredClone(state);

  if (isOpponentsBlotThere(point, newState)) {
    hitBlot(point, newState);
  }

  const checker = newState.bar[newState.currentPlayer].pop();
  if (!checker)
    throw new Error(`No ${newState.currentPlayer} checkers  in bar`);
  newState.board[point].push(checker);
  const die = newState.currentPlayer === "black" ? point + 1 : 24 - point;
  const dieIndex = newState.dice.indexOf(die);
  removeDie(dieIndex, newState); // remove die
  socket.emit("update state", newState, roomId);
}

export function emitBearOff(point: number, dieIndex: number, state: GameState, roomId: string) {
  const newState = structuredClone(state);
  const checker = newState.board[point].pop()!;
  newState.borneOff[checker.color].push(checker);
  removeDie(dieIndex, newState);
  socket.emit("update state", newState, roomId);
}

export function emitEndTurn(state: GameState, roomId: string) {
  const newState = structuredClone(state);
  changeTurn(newState);
  newState.dice = [];
  socket.emit("update state", newState, roomId);
}

export function emitGameOver(winner: Player, points: number, state: GameState, roomId: string) {
  const score = structuredClone(state.score);
  score[winner] += points;
  const newState = { ...initialState, score, currentPlayer: winner };
  socket.emit("update state", newState, roomId);
}

export default socket;
