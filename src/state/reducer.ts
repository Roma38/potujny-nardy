import { RoomState } from "@/lib/types";

export type GameState = RoomState & { selectedPoint: number | null };

export type GameAction =
  | { type: "ROLL_DICE"; dice: number[] }
  | { type: "SELECT_POINT"; point: number | null }
  | { type: "UPDATE_STATE"; state: Partial<GameState> };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "ROLL_DICE":
      return { ...state, dice: action.dice };

    case "SELECT_POINT":
      return { ...state, selectedPoint: action.point };

    case "UPDATE_STATE":
      console.log(action)
      return { ...state, ...action.state };

    default:
      return state;
  }
}
