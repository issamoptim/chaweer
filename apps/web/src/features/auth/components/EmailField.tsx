import type { UseFormRegisterReturn } from "react-hook-form";

interface EmailFieldProps {
  register: UseFormRegisterReturn;
  error?: string;
  disabled?: boolean;
}

export function EmailField({ register, error, disabled }: EmailFieldProps) {
  const errorId = "email-error";
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="email" className="text-sm font-medium text-foreground">
        Adresse e-mail
      </label>
      <input
        id="email"
        type="email"
        autoComplete="email"
        placeholder="vous@exemple.com"
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
