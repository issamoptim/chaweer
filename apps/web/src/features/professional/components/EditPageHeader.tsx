import type { ReactNode } from "react";
import { Pencil } from "lucide-react";

interface EditPageHeaderProps {
  title: string;
  subtitle: string;
  isEditing: boolean;
  onEdit: () => void;
  disabled?: boolean;
  hint?: ReactNode;
}

export function EditPageHeader({
  title,
  subtitle,
  isEditing,
  onEdit,
  disabled,
  hint,
}: EditPageHeaderProps) {
  return (
    <header className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-[27px] font-bold tracking-[-0.02em] text-[#1C1B1A]">{title}</h1>
        <p className="mt-1 text-[14.5px] text-[#6B6862]">{subtitle}</p>
        {hint && <p className="mt-2 text-[13px] font-medium text-[#0F766E]">{hint}</p>}
      </div>
      {!isEditing && (
        <button
          type="button"
          onClick={onEdit}
          disabled={disabled}
          className="flex h-[42px] shrink-0 items-center gap-2 rounded-[10px] border-[1.5px] border-[#0F766E] px-4 text-[14px] font-semibold text-[#0F766E] transition-colors hover:bg-[#E6F2F0] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(20,184,166,0.35)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Modifier
        </button>
      )}
    </header>
  );
}
