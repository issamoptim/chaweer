interface ProSelectOption {
  value: string;
  label: string;
}

interface ProSelectProps {
  label: string;
  name: string;
  value: string;
  options: ProSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string | null;
  hint?: string;
  onBlur?: () => void;
}

export function ProSelect({
  label,
  name,
  value,
  options,
  onChange,
  placeholder = "Sélectionner",
  disabled,
  required,
  error,
  hint,
  onBlur,
}: ProSelectProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-[7px] text-[13.5px] font-semibold text-[#1C1B1A]">
        {label}
        {required && <span className="ml-0.5 text-[#B4231F]">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`h-[50px] w-full rounded-[12px] border-[1.5px] bg-white px-[13px] text-[15px] font-medium text-[#1C1B1A] focus:outline-none focus:ring-[3px] disabled:cursor-not-allowed disabled:bg-[#F2F1EF] disabled:text-[#9A968E] ${
          error
            ? "border-[#B4231F] focus:border-[#B4231F] focus:ring-[rgba(180,35,31,0.20)]"
            : "border-[#E7E5E1] focus:border-[#0F766E] focus:ring-[rgba(20,184,166,0.40)]"
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="mt-[7px] text-[12.5px] text-[#B4231F]">{error}</p>
      ) : hint ? (
        <p className="mt-[7px] text-[12.5px] text-[#9A968E]">{hint}</p>
      ) : null}
    </div>
  );
}
