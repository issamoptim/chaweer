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
}: TextFieldProps) {
  const errorId = `${name}-error`;
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
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
        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        {...register}
      />
      {hasError && (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
