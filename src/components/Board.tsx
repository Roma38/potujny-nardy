import { ReactNode } from "react";
import { TChecker } from "@/lib/types";
import Checker from "./Checker";

type Props = {
  board: TChecker[][];
  selectedPoint: number | null;
  onPointClick: (index: number) => void;
  children: ReactNode;
};

export default function Board({ children, board, selectedPoint, onPointClick }: Props) {
  const renderCheckers = (checkers: TChecker[]) =>
    checkers.map(({color}, i) => (
      <Checker key={i} color={color}/>
    ));

  return (
    <div
      className="relative mt-3 p-6 rounded-lg text-white shadow-xl bg-contain"
      style={{
        backgroundImage: "url('https://grizly.club/uploads/posts/2023-01/thumbs/1672792549_grizly-club-p-tekstura-temnogo-dereva-19.jpg')",
      }}
    >
      {/* Bar */}
      {children}
      {/* Top points (12–23) */}
      <div className="flex justify-between">
        {board.slice(12, 24).map((point, i) => {
          const idx = i + 12;
          return (
            <div
              key={idx}
              className={`w-10 h-64 flex flex-col items-center bg-yellow-100/20 rounded-t-full cursor-pointer 
                ${selectedPoint === idx ? "bg-gradient-to-b from-amber-500/30" : ""} 
                ${idx === 17 ? "mr-10" : ""}`}
              onClick={() => onPointClick(idx)}
            >
              <div className="flex flex-col-reverse items-center justify-end h-full gap-y-1 p-1">
                {renderCheckers(point)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom points (11–0) */}
      <div className="flex justify-between">
        {board.slice(0, 12).map((_, i) => {
          const idx = 11 - i;
          return (
            <div
              key={idx}
              className={`w-10 h-64 flex flex-col items-center bg-yellow-100/20 rounded-b-full cursor-pointer 
                ${selectedPoint === idx ? "bg-gradient-to-t from-amber-500/30" : ""} 
                ${idx === 6 ? "mr-10" : ""}`}
              onClick={() => onPointClick(idx)}
            >
              {/* Align checkers to bottom */}
              <div className="flex flex-col items-center justify-end h-full gap-y-1 p-1">
                {renderCheckers(board[idx])}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
