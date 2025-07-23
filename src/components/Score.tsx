'use client';

import { TPlayer } from "@/lib/types";
import { TGameState } from "@/hooks/gameReducer";

type Props = {
  player: TPlayer;
  score: TGameState['score'];
  isUsersTurn: boolean;
  isPlayerConnected: boolean;
};

export default function Score({ player, score, isUsersTurn, isPlayerConnected }: Props) {
  return (
    <div className={`relative w-[100px] pt-2 text-center rounded-xl outline-black ${isUsersTurn ? "outline-4 bg-green-800" : ""}`}>
      <div>{player === 'white' ? '⚪ White' : '⚫ Black'}</div>
      <span className="text-7xl">{score[player]}</span>
      {!isPlayerConnected && 
        <div className="absolute top-0 right-0 left-0 bottom-0 bg-green-800/50 flex items-center text-shadow-lg/90">
          Not connected
        </div>}
    </div>
  );
}