type Props = {
  dice: number[];
  onRoll: () => void;
};

export default function Dice({ dice, onRoll }: Props) {
  const isDisabled = Boolean(dice.length);

  return (
    <div className="flex items-center gap-4 mt-4">
      <button
        onClick={onRoll}
        disabled={isDisabled}
        className={`px-4 py-2 rounded text-black font-semibold ${isDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-yellow-500 hover:bg-yellow-600"
          }`}
      >
        Roll Dice 🎲
      </button>

      <div className="flex gap-2">
        {dice.map((die, i) => (
          <div
            key={i}
            className="w-8 h-8 flex items-center justify-center bg-white text-black font-bold rounded shadow"
          >
            {die}
          </div>
        ))}
      </div>
    </div>
  );
}
