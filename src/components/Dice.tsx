type Props = {
  dice: number[];
  isUsersTurn: boolean;
  onRoll: () => void;
};

export default function Dice({ dice, isUsersTurn, onRoll }: Props) {
  const isDisabled = Boolean(dice.length);

  return (
    <div className="flex items-center justify-center gap-4 mt-4">
      {!dice.length && isUsersTurn && <button
        onClick={onRoll}
        disabled={isDisabled}
        className={`px-4 py-2 rounded text-black font-semibold bg-amber-500 hover:bg-amber-600 ${isDisabled ? "opacity-40 hover:cursor-not-allowed" : "" } cursor-pointer text-black rounded-md transition `}
      >
        Roll Dice 🎲
      </button>}

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
