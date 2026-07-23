import { ChaweerLogo } from "@/components/ChaweerLogo";

interface AuthHeaderProps {
  title: string;
  description?: string;
}

export function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <ChaweerLogo size="md" showArabic={false} />
      <h1 className="text-xl font-bold text-foreground">{title}</h1>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}
