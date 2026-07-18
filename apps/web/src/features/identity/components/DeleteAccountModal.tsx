import { useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";

interface DeleteAccountModalProps {
  open: boolean;
  onClose: () => void;
}

export function DeleteAccountModal({ open, onClose }: DeleteAccountModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previousFocus.current = document.activeElement as HTMLElement;
    dialogRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-account-title"
        tabIndex={-1}
        className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
          <div>
            <h2 id="delete-account-title" className="text-base font-semibold text-foreground">
              Supprimer mon compte
            </h2>
          </div>
        </div>

        <div className="mb-6 space-y-2 text-sm text-muted-foreground">
          <p>
            La suppression de votre compte est une <strong className="text-foreground">suppression logique</strong>.
            Votre compte sera conservé pendant <strong className="text-foreground">30 jours</strong>
            {" "}durant lesquels vous pourrez le restaurer.
          </p>
          <p>
            Une <strong className="text-foreground">réauthentification</strong> sera requise pour confirmer cette action.
          </p>
          <p>
            À l'issue des 30 jours, la suppression définitive sera exécutée automatiquement.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
          >
            Je comprends, continuer
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Cette fonctionnalité sera disponible prochainement.
        </p>
      </div>
    </div>
  );
}
