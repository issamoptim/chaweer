import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export function PrimaryButton({
  children,
  type = "submit",
  disabled,
  loading,
  onClick,
  className,
  ...rest
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(
        "flex h-[50px] w-full items-center justify-center gap-2 rounded-[12px] bg-primary px-4 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-[#134E4A] hover:shadow-[0_4px_14px_rgba(15,118,110,0.25)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(20,184,166,0.40)] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:bg-[#CFD8D6] disabled:text-[#8A9997] disabled:shadow-none",
        className,
      )}
      {...rest}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  );
}
