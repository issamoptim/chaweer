interface ProTextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  rows?: number;
}

export function ProTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  maxLength = 600,
  disabled,
  rows = 5,
}: ProTextareaProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-[7px] text-[13.5px] font-semibold text-[#1C1B1A]">
        {label}
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
        className="w-full resize-y rounded-[12px] border-[1.5px] border-[#E7E5E1] bg-white px-[15px] py-3 text-[15px] font-medium text-[#1C1B1A] placeholder:text-[#B4AFA6] focus:border-[#0F766E] focus:outline-none focus:ring-[3px] focus:ring-[rgba(20,184,166,0.40)] disabled:cursor-not-allowed disabled:bg-[#F2F1EF] disabled:text-[#9A968E]"
      />
      <p className="mt-[7px] text-right text-[12.5px] text-[#9A968E]">
        {value.length}/{maxLength}
      </p>
    </div>
  );
}
