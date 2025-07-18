import { GameState } from "@/hooks/gameReducer";

type Props = {
  borneOff: GameState['borneOff'];
  bearOff: () => void;
};

export default function BorneOff({ borneOff, bearOff }: Props) {
  return (
    <div className="flex gap-8 my-4 cursor-pointer justify-center" onClick={bearOff}>
      <div className="flex flex-col items-center">
        <span className="text-sm mb-1">White Off</span>
        <div className="flex flex-wrap gap-1 max-w-[160px]">
          {borneOff.white.map((_, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full border bg-gradient-to-b from-white to-gray-200 border-gray-400"
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <span className="text-sm mb-1">Black Off</span>
        <div className="flex flex-wrap gap-1 max-w-[160px]">
          {borneOff.black.map((_, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full border bg-gradient-to-b from-gray-900 to-black border-gray-700"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
