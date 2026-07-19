interface InfoRowProps {
  label: string;
  value: string | null;
  fallback?: string;
}

export function InfoRow({ label, value, fallback = "Non renseigné" }: InfoRowProps) {
  return (
    <div className="flex flex-col gap-1 py-4">
      <dt className="text-[13px] font-medium text-[#9A968E]">{label}</dt>
      <dd className={`text-[15px] font-medium ${value ? "text-foreground" : "text-[#B4AFA6]"}`}>
        {value || fallback}
      </dd>
    </div>
  );
}
