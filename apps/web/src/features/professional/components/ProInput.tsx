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
        className="h-[50px] w-full rounded-[12px] border-[1.5px] border-[#E7E5E1] bg-white px-[15px] text-[15px] font-medium text-[#1C1B1A] placeholder:text-[#B4AFA6] focus:border-[#0F766E] focus:outline-none focus:ring-[3px] focus:ring-[rgba(20,184,166,0.40)] disabled:cursor-not-allowed disabled:bg-[#F2F1EF] disabled:text-[#9A968E]"
      />
    </div>
  );
}
