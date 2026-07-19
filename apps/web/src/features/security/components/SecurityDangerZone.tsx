import { useState } from "react";
import { DeleteAccountConfirmModal } from "./DeleteAccountConfirmModal";

export function SecurityDangerZone() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section
        aria-labelledby="danger-zone-title"
        className="rounded-[16px] border border-[#F3D9D7] bg-[#FDF3F2] p-7 shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)]"
      >
        <h3 id="danger-zone-title" className="mb-2 text-[17px] font-bold text-foreground">
          Supprimer le compte
        </h3>
        <p className="mb-4 text-[14px] text-[#6B6862]">
          La suppression de votre compte est définitive. Toutes vos données seront supprimées et
          cette action ne peut pas être annulée.
        </p>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex h-[44px] items-center rounded-[11px] border border-[#E9C9C7] bg-white px-4 text-[14px] font-medium text-[#B4231F] transition-colors hover:bg-[#FBEAE9] hover:border-[#DBB4B2] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(180,35,31,0.28)]"
        >
          Supprimer mon compte
        </button>
      </section>
      <DeleteAccountConfirmModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
