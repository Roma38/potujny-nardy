import { GameState } from "@/hooks/gameReducer";
import { initialState } from "@/lib/initialState";
import socket from "@/lib/socket";
import { Player } from "@/lib/types";

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
}

function removeDie(dieIndex: number, state: GameState): GameState {
  state.dice.splice(dieIndex, 1);
  if (!state.dice.length) {
    changeTurn(state);
  }

  return state;
}

export function emitMoveChecker(
  from: number,
  to: number,
  state: GameState,
  roomId: string
) {
  const newState = structuredClone(state);

  if (isOpponentsBlotThere(to, newState)) {
    hitBlot(to, newState);
  }

  newState.board[to].push(newState.board[from].pop()!); // move checker
  const dieIndex = newState.dice.indexOf(Math.abs(from - to));
  removeDie(dieIndex, newState); // remove die

  socket.emit("update state", newState, roomId);
}

export function emitReEnterChecker(
  point: number,
  state: GameState,
  roomId: string
) {
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

export function emitBearOff(
  point: number,
  dieIndex: number,
  state: GameState,
  roomId: string
) {
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

export function emitGameOver(
  winner: Player,
  points: number,
  state: GameState,
  roomId: string
) {
  const score = structuredClone(state.score);
  score[winner] += points;
  const newState = { ...initialState, score, currentPlayer: winner };
  socket.emit("update state", newState, roomId);
}
