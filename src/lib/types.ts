export type Player = "white" | "black";

export type Checker = {
  color: Player;
};

export type Board = Checker[][];

export type RoomState = {
  board: Board;
  currentPlayer: Player;
  dice: number[];
  bar: { white: Checker[]; black: Checker[] };
  borneOff: { white: Checker[]; black: Checker[] };
  score: { white: number; black: number };
};

export type Room = {
  visitors: string[];
  state: RoomState;
};

export type Rooms = Record<string, Room>;
