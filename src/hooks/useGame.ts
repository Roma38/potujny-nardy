"use client";

import { useEffect, useReducer } from "react";
import { useParams } from "next/navigation";
import { initialState } from "@/lib/initialState";
import { CHECKERS_AMOUNT } from "@/lib/constants";
import { Checker, Player } from "@/lib/types";
import socket, { emitMoveChecker, emitReEnterChecker, emitBearOff ,emitEndTurn, emitGameOver } from "@/lib/socket";
import { gameReducer, GameState } from "@/hooks/gameReducer";

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, {...initialState, selectedPoint: null});
  const { roomId }: { roomId: string } = useParams()!;
  
  useEffect(() => {
    if (state.dice.length && !isHaveValidMoves()) {
      alert(`${state.currentPlayer} has no moves: ${state.dice.toString()}`);
      emitEndTurn(state, roomId);
    }
  }, [state.board, state.dice]);

  useEffect(() => {
    for (const player in state.borneOff) {
      if (state.borneOff[player as Player].length === CHECKERS_AMOUNT) {
        gameOver(player as Player);
      }
    }
  }, [state.borneOff]);

  const { board, currentPlayer, dice, selectedPoint, bar, borneOff } = state;

  function rollDice(roomId: string) {
    socket.emit("roll dice", roomId);

    if (bar[currentPlayer].length) {
      // set bar as selected point
      const point = currentPlayer === "white" ? 24 : -1
      dispatch({ type: "SELECT_POINT", point });
    }
  }

  function onPointClick(index: number): void {
    //if player has checkers in the bar
    if (bar[currentPlayer].length) {
      if (isMoveValid(currentPlayer === 'white' ? 24 : -1, index)) {
        //re-enter a checker from the bar
        emitReEnterChecker(index, state, roomId);
      }
      return;
    }
    //unselect a point
    if (selectedPoint === index || isPointClosed(index)) {
      return dispatch({ type: "SELECT_POINT", point: null });
    }
    if (isMoveValid(selectedPoint,index)) {
      return moveChecker(index);
    }
    if (!board[index][0] || board[index][0].color !== currentPlayer) {
      return dispatch({ type: "SELECT_POINT", point: null });
    }
    //select a point
    return dispatch({ type: "SELECT_POINT", point: index });
  }

  function isPointClosed(index: number):boolean {
    const secondChecker: undefined | Checker = board[index][1];
    return secondChecker && secondChecker.color !== currentPlayer;
  }
  
  function isMoveValid(from: number | null, to: number): boolean {
    if (
      from === null ||
      !dice.includes(currentPlayer === "white" ? from - to : to - from) ||
      isPointClosed(to)
    ) {
      return false;
    }

    return true;
  }

  function moveChecker(to: number): void {
    if (selectedPoint === null) {
      throw new Error("No selectedPoint");
    }
    
    emitMoveChecker(selectedPoint, to, state, roomId);
  }

  function isHaveValidMoves(): boolean {
    //if player has checkers on the bar, check if any entry point is available
    if (bar[currentPlayer].length) {
      return dice.some(
        (die) => !isPointClosed(currentPlayer === "black" ? die - 1 : 24 - die)
      );
    }

    //loop through all points and check possible moves
    for (let i = 0; i < board.length; i++) {
      const point = board[i];
      if (!point.length || point[0].color !== currentPlayer) continue;

      if (
        dice.some((die) => {
          const to = currentPlayer === "black" ? i + die : i - die;
          return to >= 0 && to <= 23 && !isPointClosed(to);
        })
      ) return true;
    }

    if (isBearingOffAllowed()) {
      if (isHasExplicitBearOff()) return true;

      const farestBearOffPoint = currentPlayer === "white"
        ? board.findLastIndex((point) => point[0] && point[0].color === currentPlayer) + 1
        : 24 - board.findIndex((point) => point[0] && point[0].color === currentPlayer);
      //if some die bigger than farest checker at home
      if (dice.some((die) => die > farestBearOffPoint)) return true;
    }

    return false;
  }

  function isBearingOffAllowed() {
    const homePositions = currentPlayer === 'white' 
      ? board.slice(0, 6)
      : board.slice(18);
    const checkersAtHome = homePositions.flat().filter(({ color }) => color === currentPlayer);

    return checkersAtHome.length + borneOff[currentPlayer].length === CHECKERS_AMOUNT;
  }

  function bearOff() {
    if (selectedPoint === null) return;
    if (!isBearingOffAllowed()) {
      return dispatch({ type: "SELECT_POINT", point: null });
    }
    const exactDie = currentPlayer === "white" 
      ? selectedPoint + 1 
      : 24 - selectedPoint;
    const dieIndex = dice.indexOf(exactDie);

    if (dieIndex !== -1) {
      emitBearOff(selectedPoint, dieIndex, state, roomId);
    }

    const prevHomePoints = currentPlayer === "white"
      ? board.slice(selectedPoint + 1, 6)
      : board.slice(18, selectedPoint);
    const isFarthestChecker = !prevHomePoints
      .flat()
      .some(({ color }) => color === currentPlayer);

    if (!isFarthestChecker) { // if it's not the farthest checker in home
      return dispatch({ type: "SELECT_POINT", point: null });
    }

    const biggerThanExactDieIndex = dice.findIndex((die) => die > exactDie);

    if (biggerThanExactDieIndex !== -1) {
      // if there are a die bigger than exact bear off die
      emitBearOff(selectedPoint, biggerThanExactDieIndex, state, roomId);
    } 
    
    return dispatch({ type: "SELECT_POINT", point: null });
  }

  function isHasExplicitBearOff(): boolean {
    for (let i = 0; i < 6; i++) { //loop through home points
      const point = currentPlayer === 'white' ? i : 23 - i;
      //if no players checkers at the point
      if(!board[point][0] ||  board[point][0].color !== currentPlayer) continue;
      //if checker can be moved exactly to born off
      const callBack = currentPlayer === "white" 
        ? (die: number) => point - die === -1
        : (die: number) => point + die === 24;

      if (dice.some(callBack)) return true;
    }

    return false;
  }

  function gameOver(winner: Player) {
    const loser: Player = winner === "white" ? "black" : "white";
    let points: number;
    
    const whiteHome = board.slice(0, 6);
    const blackHome = board.slice(18, 24);
    const [winnerHome, loserHome] = winner === "white" 
      ? [whiteHome, blackHome] 
      : [blackHome, whiteHome];
    
    if (borneOff[loser].length) { //single game
      points = 1;
    } else if (winnerHome.flat().some(({ color }) => color === loser)) {  //backgammon
      points = 3;
    } else if ( //gammon in home board
      !borneOff[loser].length &&
      loserHome.flat().length === CHECKERS_AMOUNT
    ) {
      points = 4;
    } else {  //gammon
      points = 2;
    }
    alert(`${winner} wins with ${points} ${points === 1 ? "point" : "points"}`);

    emitGameOver(winner, points, state, roomId);
  }

  return {
    state,
    rollDice,
    onPointClick,
    bearOff,
    setDice: (dice: number[]) => dispatch({ type: "ROLL_DICE", dice }),
    updateState: (state: Partial<GameState>) => dispatch({ type: "UPDATE_STATE", state }),
  };
}
