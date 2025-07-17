import { useRouter } from "next/navigation";

interface RoomCardProps {
  roomId: string;
  visitors: string[];
}

function getText(visitors: RoomCardProps['visitors']): string {
  const [white, black] = visitors;
  
  if (white && black) return "The game is on";
  if (white) return "White is waiting for opponent";
  if (black) return "Black is waiting for opponent";

  return "Room is empty";
}

export default function RoomCard({ roomId, visitors }: RoomCardProps) {
  const router = useRouter();

  return (
    <div className="bg-zinc-800 rounded-2xl p-4 mb-4 shadow-lg text-white flex flex-col gap-2">
      <div className="text-lg font-semibold">Room: <span className="text-amber-400">{roomId}</span></div>

      <div className="text-sm text-zinc-300">
        { getText(visitors) }
      </div>

      <button
        onClick={() => router.push(`/room/${roomId}`)}
        className="mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black rounded-md transition"
      >
        { visitors[0] && visitors[1] ? "Watch" : "Join" }
      </button>
    </div>
  );
}
