interface StatusPillProps {
  variant: "complete" | "incomplete" | "soon";
  label?: string;
}

export function StatusPill({ variant, label }: StatusPillProps) {
  const defaults = {
    complete: "Renseigné",
    incomplete: "À compléter",
    soon: "Bientôt",
  };

  const styles = {
    complete: "bg-[#E6F2F0] text-[#0F766E]",
    incomplete: "bg-[#FBF0D6] text-[#9A7B22]",
    soon: "bg-[#EEECE8] text-[#8A8681]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${styles[variant]}`}
    >
      {label ?? defaults[variant]}
    </span>
  );
}
