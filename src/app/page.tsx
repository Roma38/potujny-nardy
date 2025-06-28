"use client";

import Board from "../components/Board";
import Dice from "../components/Dice";
import Bar from "../components/Bar";
import { useGame } from "../hooks/useGame";

export default function Home() {
  const { state, onPointClick, rollDice } = useGame();

  return (
    <main className="min-h-screen bg-green-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Potujny Nardy</h1>
      <h2>{state.currentPlayer}</h2>
      <Bar bar={state.bar} />
      <Board
        board={state.board}
        selectedPoint={state.selectedPoint}
        onPointClick={onPointClick}
      />
      <Dice dice={state.dice} onRoll={rollDice} />
    </main>
  );
}
