import { TRoomState } from "@/lib/types";

export type TGameState = TRoomState & { selectedPoint: number | null };

export type TGameAction =
  | { type: "ROLL_DICE"; dice: number[] }
  | { type: "SELECT_POINT"; point: number | null }
  | { type: "UPDATE_STATE"; state: Partial<TGameState> };

export function gameReducer(state: TGameState, action: TGameAction): TGameState {
  switch (action.type) {
    case "ROLL_DICE":
      return { ...state, dice: action.dice };

    case "SELECT_POINT":
      return { ...state, selectedPoint: action.point };

    case "UPDATE_STATE":
      return { ...state, ...action.state };

    default:
      return state;
  }
}
