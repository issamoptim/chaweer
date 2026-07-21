import type { ReactNode } from "react";
import { BrandingPanel } from "./BrandingPanel";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <BrandingPanel />
      <div className="flex items-center justify-center px-6 py-12 sm:px-12">{children}</div>
    </div>
  );
}
