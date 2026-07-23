interface ProInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "tel" | "email";
  autoComplete?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string | null;
  hint?: string;
  onBlur?: () => void;
}

export function ProInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  disabled,
  required,
  error,
  hint,
  onBlur,
}: ProInputProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-[7px] text-[13.5px] font-semibold text-[#1C1B1A]">
        {label}
        {required && <span className="ml-0.5 text-[#B4231F]">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`h-[50px] w-full rounded-[12px] border-[1.5px] bg-white px-[15px] text-[15px] font-medium text-[#1C1B1A] placeholder:text-[#B4AFA6] focus:outline-none focus:ring-[3px] disabled:cursor-not-allowed disabled:bg-[#F2F1EF] disabled:text-[#9A968E] ${
          error
            ? "border-[#B4231F] focus:border-[#B4231F] focus:ring-[rgba(180,35,31,0.20)]"
            : "border-[#E7E5E1] focus:border-[#0F766E] focus:ring-[rgba(20,184,166,0.40)]"
        }`}
      />
      {error ? (
        <p className="mt-[7px] text-[12.5px] text-[#B4231F]">{error}</p>
      ) : hint ? (
        <p className="mt-[7px] text-[12.5px] text-[#9A968E]">{hint}</p>
      ) : null}
    </div>
  );
}
