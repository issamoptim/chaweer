export function ProfileSkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 animate-pulse" aria-label="Chargement du profil">
      <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-6">
        <div className="h-16 w-16 rounded-full bg-muted" />
        <div className="space-y-2">
          <div className="h-5 w-40 rounded bg-muted" />
          <div className="h-4 w-28 rounded bg-muted" />
          <div className="h-4 w-48 rounded bg-muted" />
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-6 space-y-3">
        <div className="h-5 w-32 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-2/3 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
      </div>
      <div className="rounded-xl border border-border bg-card p-6 space-y-3">
        <div className="h-5 w-40 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-1/2 rounded bg-muted" />
      </div>
    </div>
  );
}
