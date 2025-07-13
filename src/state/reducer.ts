import { initialState } from "@/lib/initialState";
import { Player, RoomState } from "@/lib/types";

export type GameState = RoomState & { selectedPoint: number | null };

export type GameAction =
  | { type: "ROLL_DICE"; dice: number[] }
  | { type: "SELECT_POINT"; point: number | null }
  | { type: "MOVE_CHECKER"; from: number; to: number; isHitBlot: boolean }
  | { type: "RE_ENTER_CHECKER"; color: Player; point: number; isHitBlot: boolean }
  | { type: "BEAR_OFF"; point: number; color: Player, dieIndex: number }
  | { type: "END_TURN" }
  | { type: "GAME_OVER"; winner: Player; points: number }
  | { type: "RESET_STATE"; state: GameState };


export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "ROLL_DICE":
      return { ...state, dice: action.dice };

    case "SELECT_POINT":
      return { ...state, selectedPoint: action.point };

    case "MOVE_CHECKER": {
      const { from, to, isHitBlot } = action;
      const newState = structuredClone(state);

      if (isHitBlot) {
        const blot = newState.board[to].pop(); // hit blot
        if (!blot) throw new Error("No checkers in selected point");
        newState.bar[blot.color].push(blot); // push blot to bar
      }

      newState.board[to].push(newState.board[from].pop()!); // move checker
      const dieIndex = newState.dice.indexOf(Math.abs(from - to));
      newState.dice.splice(dieIndex, 1); // remove die
      if (!newState.dice.length) {  //  switch player
        newState.currentPlayer = (newState.currentPlayer === "white") ? "black" : "white";
      }
      newState.selectedPoint = null;

      return newState;
    }

    case "RE_ENTER_CHECKER": {
      const newState = structuredClone(state);
      const { color, point, isHitBlot } = action;

      if (isHitBlot) {
        const blot = newState.board[point].pop(); // hit blot
        if (!blot) throw new Error("No checkers in selected point");
        newState.bar[blot.color].push(blot); // push blot to bar
      }

      const checker = newState.bar[color].pop();
      if (!checker) throw new Error(`No ${color} checkers  in bar`);
      newState.board[point].push(checker);
      newState.selectedPoint = null;
      const dieIndex = newState.dice.indexOf(
        color === "black" ? point + 1 : 24 - point
      );
      newState.dice.splice(dieIndex, 1); // remove die

      if (!newState.dice.length) {  //  switch player
        newState.currentPlayer = (newState.currentPlayer === "white") ? "black" : "white";
      }

      return newState;
    }

    case "BEAR_OFF": {
      const newState = structuredClone(state);
      const { point, dieIndex } = action;
      const checker = newState.board[point].pop()!;
      newState.borneOff[checker.color].push(checker);
      newState.dice.splice(dieIndex, 1);
      newState.selectedPoint = null;
      if (!newState.dice.length) {  //  switch player
        newState.currentPlayer = (newState.currentPlayer === "white") ? "black" : "white";
      }
      
      return newState;
    }

    case "END_TURN":
      return {
        ...state,
        currentPlayer: state.currentPlayer === "white" ? "black" : "white",
        dice: [],
        selectedPoint: null,
      };

    case "RESET_STATE":
      return { ...action.state };

    case "GAME_OVER":{
      const {winner, points} = action;
      const score = { ...state.score, [winner]: state.score[winner] + points };

      return { ...initialState, score, currentPlayer: winner, selectedPoint: null };
    }

    default:
      return state;
  }
}
