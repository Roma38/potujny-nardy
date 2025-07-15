'use client';

import { Player } from "@/lib/types";
import { GameState } from "@/state/reducer";

type Props = {
  player: Player;
  score: GameState['score'];
  isUsersTurn: boolean;
};

export default function Score({ player, score, isUsersTurn }: Props) {
  return (
    <div className={`w-[100px] pt-2 text-center rounded-xl outline-black ${isUsersTurn ? "outline-4 bg-green-800" : ""}`}>
      <div>{player === 'white' ? '⚪ White' : '⚫ Black'}</div>
      <span className="text-7xl">{score[player]}</span>
    </div>
  );
}