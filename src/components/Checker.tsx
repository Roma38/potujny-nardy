import { TPlayer } from "@/lib/types";

type Props = {
  color: TPlayer;
  isHighlighted?: boolean;
};

export default function Checker({ color, isHighlighted }: Props) {
  return (
    <div className={`w-7 h-7 rounded-full border shadow-md shrink-0 
      ${color === "white"
      ? "bg-gradient-to-b from-white to-gray-200 border-gray-400"
      : "bg-gradient-to-b from-gray-900 to-black border-gray-700"}
      ${isHighlighted ? "outline-2 outline-amber-500/50" : ""}`} 
    />
  );
}
