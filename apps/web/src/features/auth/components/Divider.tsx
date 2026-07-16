export function Divider() {
  return (
    <div className="flex items-center gap-3" role="separator" aria-label="ou">
      <span className="h-px flex-1 bg-border" />
      <span className="text-sm text-muted-foreground">ou</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
