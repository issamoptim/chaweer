interface ChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
}

export function Chip({ label, selected, onToggle }: ChipProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onToggle}
      className={`rounded-full border px-4 py-2 text-[13.5px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(20,184,166,0.40)] ${
        selected
          ? "border-[#0F766E] bg-[#E6F2F0] text-[#0F766E]"
          : "border-[#E7E5E1] bg-white text-[#4B4842] hover:border-[#CDE5E1]"
      }`}
    >
      {label}
    </button>
  );
}
