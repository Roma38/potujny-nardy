"use client";

import { Checker } from "@/lib/types";

type Props = {
  board: Checker[][];
  selectedPoint: number | null;
  onPointClick: (index: number) => void;
};

export default function Board({ board, selectedPoint, onPointClick }: Props) {
  const renderCheckers = (checkers: Checker[]) =>
    checkers.map((checker, i) => (
      <div
        key={i}
        className={`w-7 h-7 rounded-full border shadow-md ${checker.color === "white"
            ? "bg-gradient-to-b from-white to-gray-200 border-gray-400"
            : "bg-gradient-to-b from-gray-900 to-black border-gray-700"
          }`}
      />
    ));

  return (
    <div
      className="p-6 rounded-lg text-white shadow-xl"
      style={{
        backgroundImage: "url('https://www.transparenttextures.com/patterns/wood-pattern.png')",
        backgroundColor: "#6B4F3A",
      }}
    >
      {/* Top row numbers */}
      {/* <div className="flex justify-between mb-2 px-1">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`w-12 text-center text-xs text-gray-200 font-semibold ${i === 5 ? "mr-5" : ""}`}>
            {12 + i}
          </div>
        ))}
      </div> */}

      {/* Top points (12–23) */}
      <div className="flex justify-between mb-6">
        {board.slice(12, 24).map((point, i) => {
          const idx = i + 12;
          return (
            <div
              key={idx}
              className={`w-12 h-64 flex flex-col items-center border-x border-yellow-100 bg-yellow-100/10 rounded-md cursor-pointer ${selectedPoint === idx ? "ring-2 ring-blue-400" : ""
                } ${idx === 17 ? "mr-5" : ""}`}
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
      <div className="flex justify-between mt-6">
        {board.slice(0, 12).map((_, i) => {
          const idx = 11 - i;
          return (
            <div
              key={idx}
              className={`w-12 h-64 flex flex-col items-center border-x border-yellow-100 bg-yellow-100/10 rounded-md cursor-pointer ${selectedPoint === idx ? "ring-2 ring-blue-400" : ""
                } ${idx === 6 ? "mr-5" : ""}`}
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


      {/* Bottom row numbers */}
      {/* <div className="flex justify-between mt-2 px-1">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`w-12 text-center text-xs text-gray-200 font-semibold ${i === 5 ? "mr-5" : ""}`}>
            {11 - i}
          </div>
        ))}
      </div> */}
    </div>
  );
}
