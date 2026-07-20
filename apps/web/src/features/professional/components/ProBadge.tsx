interface ProBadgeProps {
  className?: string;
}

export function ProBadge({ className }: ProBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-[#CDE5E1] bg-[#E6F2F0] px-2.5 py-0.5 text-[11.5px] font-semibold text-[#0F766E] ${className ?? ""}`}
    >
      Espace professionnel
    </span>
  );
}
