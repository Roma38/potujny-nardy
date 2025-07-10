"use client";

import Board from "@/components/Board";
import Dice from "@/components/Dice";
import Bar from "@/components/Bar";
import BorneOff from "@/components/BorneOff";
import Score from "@/components/Score";
import { useGame } from "@/hooks/useGame";

export default function Room() {
  const { state, onPointClick, rollDice, bearOff } = useGame();

  return (
    <div className="grow">
      <div className="flex justify-between w-full">
        <Score player="white" score={state.score} />

        <div className="grow">
          <h2 className="text-xl font-bold capitalize text-center">{state.currentPlayer}</h2>
          <Bar bar={state.bar} />
          <BorneOff borneOff={state.borneOff} bearOff={bearOff} />
        </div>

        <Score player="black" score={state.score} />
      </div>

      <Board
        board={state.board}
        selectedPoint={state.selectedPoint}
        onPointClick={onPointClick}
      />

      <Dice dice={state.dice} onRoll={rollDice} />
    </div>
  );
}
