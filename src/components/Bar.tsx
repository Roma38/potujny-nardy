import { TChecker } from "@/lib/types";
import Checker from "./Checker";

type Props = {
  bar: { white: TChecker[]; black: TChecker[] };
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
        {checkers.map( ({color}, i) => <Checker key={i} color={color} /> )}
      </div>
    </div>
  );
}
