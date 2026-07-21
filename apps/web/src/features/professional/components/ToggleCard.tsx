import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";

interface ToggleCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  selected: boolean;
  onToggle: () => void;
}

export function ToggleCard({ title, subtitle, icon: Icon, selected, onToggle }: ToggleCardProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onToggle}
      className={`relative flex w-full flex-col gap-1.5 rounded-[12px] border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(20,184,166,0.40)] ${
        selected
          ? "border-[#0F766E] bg-[#E6F2F0]"
          : "border-[#E7E5E1] bg-white hover:border-[#CDE5E1]"
      }`}
    >
      {selected && (
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#0F766E] text-white">
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
      )}
      <span className="flex items-center gap-2.5">
        {Icon && (
          <Icon
            className={`h-[18px] w-[18px] ${selected ? "text-[#0F766E]" : "text-[#6B6862]"}`}
            aria-hidden="true"
          />
        )}
        <span
          className={`text-[14.5px] font-semibold ${selected ? "text-[#0F766E]" : "text-[#1C1B1A]"}`}
        >
          {title}
        </span>
      </span>
      {subtitle && <span className="text-[12.5px] text-[#6B6862]">{subtitle}</span>}
    </button>
  );
}
