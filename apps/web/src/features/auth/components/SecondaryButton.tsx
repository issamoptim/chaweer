import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SecondaryButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function SecondaryButton({
  children,
  onClick,
  disabled,
  className,
  ...rest
}: SecondaryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-[50px] w-full items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-[#E7E5E1] bg-card px-4 text-[15px] font-semibold text-foreground transition-colors hover:bg-[#F7F7F5] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(20,184,166,0.4)] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:bg-[#F2F1EF] disabled:text-[#9A968E]",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
