"use client";

import { useEffect, useState } from "react";
import { initialBoard } from "../lib/initialState";

export type Player = "white" | "black";

export type Checker = {
  color: Player;
};

export type GameState = {
  board: Checker[][];
  currentPlayer: Player;
  dice: number[];
  selectedPoint: number | null;
  bar: { white: Checker[]; black: Checker[] };
  borneOff: { white: Checker[]; black: Checker[] };
};

export function useGame() {
  const [board, setBoard] = useState<GameState['board']>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<GameState['currentPlayer']>('white');
  const [dice, setDice] = useState<GameState['dice']>([]);
  const [selectedPoint, setSelectedPoint] = useState<GameState['selectedPoint']>(null);
  const [bar, setBar] = useState<GameState["bar"]>({ white: [], black: [] });
  const [borneOff, setBorneOff] = useState<GameState["borneOff"]>({white: [],black: [],});

  useEffect(() => {
    if ((dice.length && !isHaveValidMoves())) {
      alert(`You has no moves: ${dice.toString()}`)
      endTurn();
    }
    ;
  }, [board, dice])

  function rollDice() {
    const d1 = Math.ceil(Math.random() * 6);
    const d2 = Math.ceil(Math.random() * 6);
    const result = d1 === d2 ? [d1, d1, d1, d1] : [d1, d2];

    setDice(result);
    // set bar as selected point
    if (bar[currentPlayer].length) {
      setSelectedPoint(currentPlayer === "white" ? 24 : -1);
    }
  }

  function onPointClick(index: number): void {
    //if player has checkers in the bar
    if (bar[currentPlayer].length) {
      if (isMoveValid(currentPlayer === 'white' ? 24 : -1, index)) {
        //re-enter a checker from the bar
        reEnterChecker(index);
      }
      return;
    }
    //unselect a point
    if (selectedPoint === index || isPointClosed(index)) {
      return setSelectedPoint(null);
    }
    // if (selectedPoint === null) {
    //   return setSelectedPoint(index);
    // }
    if (isMoveValid(selectedPoint,index)) {
      return moveChecker(index);
    }
    if (!board[index][0] || board[index][0].color !== currentPlayer) {
      return setSelectedPoint(null);
    }
    //select a point
    return setSelectedPoint(index);
  }

  function isPointClosed(index: number):boolean {
    const secondChecker: undefined | Checker = board[index][1];
    return secondChecker && secondChecker.color !== currentPlayer;
  }
  
  function isMoveValid(from: GameState['selectedPoint'], to: number): boolean {
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
    const newBoard = structuredClone(board);
    if (selectedPoint === null || !newBoard[selectedPoint]) {
      throw new Error("No checkers in selected point");
    }
    if (isOponentsBlotThere(to)) {
      const newBar = structuredClone(bar);
      setBar(hitBlot(newBoard, newBar, to).barClone);
    }
    newBoard[to].push(newBoard[selectedPoint].pop()!);  //move checker
    setBoard(newBoard);
    removeDie(Math.abs(selectedPoint - to));
    setSelectedPoint(null);
  }

  //hit the blot if it's there
  function hitBlot(boardClone: GameState['board'], barClone: GameState['bar'], point: number) {
    // if (boardClone[point][0] && boardClone[point][0].color !== currentPlayer) {
      const checker = boardClone[point].pop();
      if (!checker) {
        throw new Error("No checkers in selected point");
      }
      // setBar({ ...bar, [checker.color]: [...bar[checker.color], checker] });
      barClone[checker.color].push(checker);

      return { boardClone, barClone };
    // }
  }

  function isOponentsBlotThere(point:number): boolean {
     return board[point][0] && board[point][0].color !== currentPlayer ? true : false;
  }

  function removeDie(value:number) {
    const newDice = [...dice];
    newDice.splice(newDice.indexOf(value), 1);
    setDice(newDice);

    if (!newDice.length) {
      endTurn();
    }
  }

  function reEnterChecker(to: number): void {
    const newBoard = structuredClone(board);
    const newBar = structuredClone(bar);
    if (isOponentsBlotThere(to)) {
      hitBlot(newBoard, newBar, to);
    }
    newBoard[to].push(newBar[currentPlayer].pop()!); //move checker
    setBoard(newBoard);
    setBar(newBar);
    removeDie(currentPlayer === 'black' ? to + 1 : 24 - to);
  }
  

  function endTurn() {
    setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
    setSelectedPoint(null);
    setDice([]);
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

    return false;
  }

  return {
    state: { board, currentPlayer, dice , selectedPoint, bar, borneOff},
    rollDice,
    endTurn,
    onPointClick,
  };
}
