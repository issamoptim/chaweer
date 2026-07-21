interface SegmentedOption {
  value: number;
  label: string;
}

interface SegmentedControlProps {
  options: SegmentedOption[];
  value: number | null;
  onChange: (value: number) => void;
  ariaLabel?: string;
}

export function SegmentedControl({ options, value, onChange, ariaLabel }: SegmentedControlProps) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex rounded-[12px] border border-[#E7E5E1] bg-[#F7F7F5] p-1"
    >
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={`min-w-[64px] rounded-[9px] px-4 py-2 text-[14px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(20,184,166,0.40)] ${
              selected ? "bg-white text-[#0F766E] shadow-sm" : "text-[#6B6862] hover:text-[#1C1B1A]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
