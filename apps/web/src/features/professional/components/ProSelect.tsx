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
}

export function ProSelect({
  label,
  name,
  value,
  options,
  onChange,
  placeholder = "Sélectionner",
  disabled,
}: ProSelectProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-[7px] text-[13.5px] font-semibold text-[#1C1B1A]">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="h-[50px] w-full rounded-[12px] border-[1.5px] border-[#E7E5E1] bg-white px-[13px] text-[15px] font-medium text-[#1C1B1A] focus:border-[#0F766E] focus:outline-none focus:ring-[3px] focus:ring-[rgba(20,184,166,0.40)] disabled:cursor-not-allowed disabled:bg-[#F2F1EF] disabled:text-[#9A968E]"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
