export type TPlayer = "white" | "black";

export type TChecker = {
  color: TPlayer;
};

export type TBoard = TChecker[][];

export type TRoomState = {
  board: TBoard;
  currentPlayer: TPlayer;
  dice: number[];
  bar: { white: TChecker[]; black: TChecker[] };
  borneOff: { white: TChecker[]; black: TChecker[] };
  score: { white: number; black: number };
};

export type TRoom = {
  visitors: string[];
  state: TRoomState;
};

export type TRooms = Record<string, TRoom>;

export type TNote = {
  id: string;
  text: string;
};
