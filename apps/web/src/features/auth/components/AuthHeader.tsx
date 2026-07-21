interface AuthHeaderProps {
  title: string;
  description?: string;
}

export function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span className="text-2xl font-bold tracking-tight text-primary">Chaweer</span>
      <h1 className="text-xl font-bold text-foreground">{title}</h1>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}
