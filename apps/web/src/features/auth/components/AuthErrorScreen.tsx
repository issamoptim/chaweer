import { useSessionRestore } from "../hooks/useSessionRestore";

export function AuthErrorScreen() {
  const { restoreSession } = useSessionRestore();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <p className="text-center text-muted-foreground">
        Impossible de restaurer votre session.
      </p>
      <button
        type="button"
        onClick={() => void restoreSession()}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
      >
        Réessayer
      </button>
    </div>
  );
}
