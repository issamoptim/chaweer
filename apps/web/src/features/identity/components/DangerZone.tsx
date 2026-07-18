import { useState } from "react";
import { DeleteAccountModal } from "./DeleteAccountModal";

export function DangerZone() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
      <h3 className="mb-2 text-base font-semibold text-foreground">Zone de danger</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        La suppression de votre compte est définitive après 30 jours. Cette action nécessite une réauthentification.
      </p>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="rounded-lg border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
      >
        Supprimer mon compte
      </button>
      <DeleteAccountModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
