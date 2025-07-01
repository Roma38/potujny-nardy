'use client';

import { GameState, Player } from "@/hooks/useGame";

type Props = {
  player: Player;
  score: GameState['score'];
};

export default function Score({ player, score }: Props) {
  return (
    <div className="w-[120px] text-center">
      <div>{player === 'white' ? '⚪ White' : '⚫ Black'}</div>
      <span className="text-7xl">{score[player]}</span>
    </div>
  );
}