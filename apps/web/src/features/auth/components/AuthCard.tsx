import type { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="w-full max-w-[480px] rounded-xl border border-border bg-card p-6 shadow-sm">
      {children}
    </div>
  );
}
