interface InfoRowProps {
  label: string;
  value: string | null;
  fallback?: string;
}

export function InfoRow({ label, value, fallback = "Non renseigné" }: InfoRowProps) {
  return (
    <div className="flex flex-col gap-1 py-2">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">
        {value || fallback}
      </dd>
    </div>
  );
}
