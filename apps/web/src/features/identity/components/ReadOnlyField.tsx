import { Lock } from "lucide-react";

interface ReadOnlyFieldProps {
  label: string;
  value: string | null;
  helperText?: string;
}

export function ReadOnlyField({ label, value, helperText }: ReadOnlyFieldProps) {
  return (
    <div className="flex flex-col">
      <label className="flex items-center gap-[6px] text-[13.5px] font-semibold text-[#6B6862] mb-[7px]">
        {label}
        <Lock className="h-[13px] w-[13px] shrink-0 text-[#9A968E]" aria-hidden="true" />
      </label>
      <div
        className="flex min-h-[50px] items-center gap-2 rounded-[12px] border-[1.5px] border-[#EAE8E3] bg-[#F2F1EF] px-[15px] py-[14px]"
        tabIndex={-1}
      >
        <span className="text-[15px] font-medium text-[#6B6862]">{value || "Non renseigné"}</span>
      </div>
      {helperText && <p className="text-[12.5px] text-[#9A968E] mt-[7px]">{helperText}</p>}
    </div>
  );
}
