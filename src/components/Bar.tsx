import { TChecker } from "@/lib/types";
import Checker from "./Checker";
import { TGameState } from "@/hooks/gameReducer";

type Props = {
  bar: { white: TChecker[]; black: TChecker[] };
  selectedPoint: TGameState["selectedPoint"];
};

export default function Bar({ bar, selectedPoint }: Props) {
  return (
    <div className="absolute top-[50%] left-[50%] translate-[-50%] flex flex-col items-center gap-1">
      {bar['white'].map(({ color }, i) => 
        <Checker key={i} color={color} isHighlighted={selectedPoint === 24 && i === 0} /> )}
      {bar['black'].map(({ color }, i) => 
        <Checker key={i} color={color} isHighlighted={selectedPoint === -1 && i === 0} />)}
    </div>
  );
}
