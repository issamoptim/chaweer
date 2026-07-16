import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface ProfessionalEntryProps {
  text: string;
  linkText: string;
  to: string;
}

export function ProfessionalEntry({ text, linkText, to }: ProfessionalEntryProps) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <p className="text-sm text-muted-foreground">{text}</p>
      <Link
        to={to}
        className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        {linkText}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}
