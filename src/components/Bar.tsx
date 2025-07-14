"use client";

import { Checker } from "@/lib/types";

type Props = {
  bar: { white: Checker[]; black: Checker[] };
};

export default function Bar({ bar }: Props) {
  const checkers = bar['white'].concat(bar['black']);

  return (
    <div className="flex flex-col items-center mb-4">
      <div className="text-white mb-2 font-semibold">Bar</div>
      <div className="flex gap-1">
        {checkers.length === 0 && (
          <div className="text-gray-400 text-xs italic">No checkers on bar</div>
        )}
        {checkers.map((checker, i) => (
          <div
            key={i}
            className={`w-7 h-7 rounded-full border shadow-md cursor-pointer ${checker.color === "white"
                ? "bg-gradient-to-b from-white to-gray-200 border-gray-400"
                : "bg-gradient-to-b from-gray-900 to-black border-gray-700"
              }`}
          />
        ))}
      </div>
    </div>
  );
}
