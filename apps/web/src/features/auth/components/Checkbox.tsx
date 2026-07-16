import type { UseFormRegisterReturn } from "react-hook-form";

interface CheckboxProps {
  label: string;
  name: string;
  register: UseFormRegisterReturn;
  error?: string;
}

export function Checkbox({ label, name, register, error }: CheckboxProps) {
  const errorId = `${name}-error`;
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-2">
        <input
          id={name}
          type="checkbox"
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className="mt-1 h-4 w-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          {...register}
        />
        <label htmlFor={name} className="text-sm text-muted-foreground">
          {label}
        </label>
      </div>
      {hasError && (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
