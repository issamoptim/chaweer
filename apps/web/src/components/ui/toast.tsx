import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "error";

export interface ToastData {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastProps {
  toast: ToastData;
}

export function Toast({ toast }: ToastProps) {
  const isSuccess = toast.variant === "success";

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg",
        isSuccess
          ? "border-primary/20 bg-card text-foreground"
          : "border-destructive/20 bg-card text-foreground"
      )}
    >
      {isSuccess ? (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      ) : (
        <XCircle className="h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
      )}
      <p className="text-sm">{toast.message}</p>
    </div>
  );
}
