interface ReadFieldProps {
  label: string;
  value: string | null | undefined;
  emptyText?: string;
}

export function ReadField({ label, value, emptyText = "Non renseigné" }: ReadFieldProps) {
  const displayValue = value && value.trim() ? value : null;

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[12px] font-semibold uppercase tracking-wide text-[#9A968E]">
        {label}
      </span>
      {displayValue ? (
        <span className="whitespace-pre-wrap text-[14.5px] font-medium text-[#1C1B1A]">{displayValue}</span>
      ) : (
        <span className="text-[14.5px] italic text-[#B4AFA6]">{emptyText}</span>
      )}
    </div>
  );
}
