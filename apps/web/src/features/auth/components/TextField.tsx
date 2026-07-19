import type { UseFormRegisterReturn } from "react-hook-form";

interface TextFieldProps {
  label: string;
  name: string;
  register: UseFormRegisterReturn;
  error?: string;
  disabled?: boolean;
  type?: "text" | "email" | "password" | "tel" | "url";
  placeholder?: string;
  autocomplete?: string;
  borderWidth?: string;
  paddingX?: string;
  focusRingClass?: string;
  errorTextClass?: string;
  labelMarginBottom?: string;
}

export function TextField({
  label,
  name,
  register,
  error,
  disabled,
  type = "text",
  placeholder,
  autocomplete,
  borderWidth = "border",
  paddingX = "px-4",
  focusRingClass = "focus:border-primary focus:outline-none focus:ring-2 focus:ring-accent/45",
  errorTextClass = "text-sm text-destructive",
  labelMarginBottom,
}: TextFieldProps) {
  const errorId = `${name}-error`;
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col">
      <label htmlFor={name} className={`text-[13.5px] font-semibold text-foreground ${labelMarginBottom ?? "mb-2"}`}>
        {label}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autocomplete}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        className={`h-[50px] w-full rounded-[12px] ${borderWidth} border-input bg-background ${paddingX} text-[15px] font-medium text-foreground placeholder:text-muted-foreground ${focusRingClass} disabled:cursor-not-allowed disabled:bg-[#F2F1EF] disabled:text-[#9A968E]`}
        {...register}
      />
      {hasError && (
        <p id={errorId} className={errorTextClass} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
