"use client";

import { useEffect, useState } from "react";
import { initialBoard } from "@/lib/initialState";
import { CHECKERS_AMOUNT } from "@/lib/constants";

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
  score: { white: number; black: number; };
};

export function useGame() {
  const [board, setBoard] = useState<GameState['board']>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<GameState['currentPlayer']>('white');
  const [dice, setDice] = useState<GameState['dice']>([]);
  const [selectedPoint, setSelectedPoint] = useState<GameState['selectedPoint']>(null);
  const [bar, setBar] = useState<GameState["bar"]>({ white: [], black: [] });
  const [borneOff, setBorneOff] = useState<GameState["borneOff"]>({white: [],black: [],});
  const [score, setScore] = useState<GameState['score']>({ white: 0, black: 0 });

  useEffect(() => {
    if (dice.length && !isHaveValidMoves()) {
      alert(`You have no moves: ${dice.toString()}`);
      endTurn();
    }
  }, [board, dice]);

  useEffect(() => {
    for (const player in borneOff) {
      if (borneOff[player as Player].length === CHECKERS_AMOUNT) {
        gameOver(player as Player);
      }
    }
  }, [borneOff]);

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
    if (isOpponentsBlotThere(to)) {
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

  function isOpponentsBlotThere(point:number): boolean {
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
    if (isOpponentsBlotThere(to)) {
      hitBlot(newBoard, newBar, to);
    }
    newBoard[to].push(newBar[currentPlayer].pop()!); //move checker
    setBoard(newBoard);
    setBar(newBar);
    setSelectedPoint(null);
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

  function isBearOffValid(): boolean {
    if (selectedPoint === null) return false;

    const bearOffPoint = currentPlayer === "white" ? selectedPoint + 1 : 24 - selectedPoint;
    //if checker exactly on the bear off position
    if (dice.includes(bearOffPoint)) {
      removeDie(bearOffPoint);

      return true
    };

    const prevHomePoints =
      currentPlayer === "white"
        ? board.slice(selectedPoint + 1, 6)
        : board.slice(18, selectedPoint);
    const isFarestChecker = !prevHomePoints
      .flat()
      .some(({ color }) => color === currentPlayer);
    //if some die bigger then position, and if it's farest checker
    if (dice.some((die) => die > bearOffPoint) && isFarestChecker){
      removeDie(Math.max(...dice)); //remove biggest die

      return true;
    }

    return false;
  }

  function bearOff() {
    if (selectedPoint === null) return;
    if (!isBearingOffAllowed() || !isBearOffValid()) {
      return setSelectedPoint(null);
    }

    const newBoard = structuredClone(board);
    const newBorneOff = structuredClone(borneOff);
    const checker = newBoard[selectedPoint].pop()!;
    newBorneOff[checker.color].push(checker); //bear off checker
    setBoard(newBoard);
    setBorneOff(newBorneOff);
    setSelectedPoint(null);
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
      points = 2;
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
    
    setScore({ ...score, [winner]: score[winner] + points });
    setCurrentPlayer(winner);
    setSelectedPoint(null);
    setDice([]);
    setBoard(initialBoard);
    setBar({ white: [], black: [] });
    setBorneOff({ white: [], black: [] });
  }

  return {
    state: { board, currentPlayer, dice, selectedPoint, bar, borneOff, score },
    rollDice,
    endTurn,
    onPointClick,
    bearOff,
  };
}
