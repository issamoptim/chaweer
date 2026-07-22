interface ProTextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  disabled?: boolean;
  rows?: number;
  required?: boolean;
  error?: string | null;
  hint?: string;
  onBlur?: () => void;
}

export function ProTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  maxLength = 600,
  minLength,
  disabled,
  rows = 5,
  required,
  error,
  hint,
  onBlur,
}: ProTextareaProps) {
  const showMinHint = minLength !== undefined && value.length < minLength;
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-[7px] text-[13.5px] font-semibold text-[#1C1B1A]">
        {label}
        {required && <span className="ml-0.5 text-[#B4231F]">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`w-full resize-y rounded-[12px] border-[1.5px] bg-white px-[15px] py-3 text-[15px] font-medium text-[#1C1B1A] placeholder:text-[#B4AFA6] focus:outline-none focus:ring-[3px] disabled:cursor-not-allowed disabled:bg-[#F2F1EF] disabled:text-[#9A968E] ${
          error
            ? "border-[#B4231F] focus:border-[#B4231F] focus:ring-[rgba(180,35,31,0.20)]"
            : "border-[#E7E5E1] focus:border-[#0F766E] focus:ring-[rgba(20,184,166,0.40)]"
        }`}
      />
      <div className="mt-[7px] flex items-center justify-between gap-2">
        <span className="text-[12.5px]">
          {error ? (
            <span className="text-[#B4231F]">{error}</span>
          ) : hint ? (
            <span className="text-[#9A968E]">{hint}</span>
          ) : (
            <span />
          )}
        </span>
        <span className={`text-[12.5px] ${showMinHint ? "text-[#B4231F]" : "text-[#9A968E]"}`}>
          {minLength !== undefined && showMinHint
            ? `${value.length}/${minLength} min`
            : `${value.length}/${maxLength}`}
        </span>
      </div>
    </div>
  );
}
