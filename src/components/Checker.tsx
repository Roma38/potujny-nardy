import { TPlayer } from "@/lib/types";

type Props = {
  color: TPlayer;
};

export default function Checker({ color }: Props) {
  return (
    <div className={`w-7 h-7 rounded-full border shadow-md ${color === "white"
      ? "bg-gradient-to-b from-white to-gray-200 border-gray-400"
      : "bg-gradient-to-b from-gray-900 to-black border-gray-700"}`} 
    />
  );
}
