import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface TextLinkProps {
  to: string;
  children: ReactNode;
}

export function TextLink({ to, children }: TextLinkProps) {
  return (
    <Link
      to={to}
      className="text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      {children}
    </Link>
  );
}
