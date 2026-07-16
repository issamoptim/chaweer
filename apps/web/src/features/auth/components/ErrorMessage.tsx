import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-lg bg-destructive/10 px-4 py-3"
    >
      <AlertCircle className="h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
      <p className="text-sm text-destructive">{message}</p>
    </div>
  );
}
