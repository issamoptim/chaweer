import { useEffect, useRef } from "react";

interface ConfirmLeaveModalProps {
  open: boolean;
  onStay: () => void;
  onLeave: () => void;
}

export function ConfirmLeaveModal({ open, onStay, onLeave }: ConfirmLeaveModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previousFocus.current = document.activeElement as HTMLElement;
    dialogRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onStay();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus.current?.focus();
    };
  }, [open, onStay]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(28,27,26,0.42)] p-4"
      onClick={onStay}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-leave-title"
        tabIndex={-1}
        className="w-full max-w-[400px] rounded-[16px] border border-[#E9E7E3] bg-card p-7 shadow-[0_20px_50px_rgba(19,78,74,0.24)] focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-leave-title" className="text-[19px] font-bold text-foreground">
          Quitter sans enregistrer ?
        </h2>

        <p className="mt-2 text-[14px] leading-[1.55] text-[#6B6862]">
          Vous avez des modifications non enregistrées.
        </p>

        <div className="mt-[22px] flex flex-row flex-wrap gap-2.5">
          <button
            type="button"
            onClick={onStay}
            className="flex h-12 flex-1 min-w-[150px] items-center justify-center rounded-[12px] bg-[#0F766E] px-5 text-[14.5px] font-semibold text-white transition-colors hover:bg-[#134E4A] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(20,184,166,0.40)]"
          >
            Continuer la modification
          </button>
          <button
            type="button"
            onClick={onLeave}
            className="flex h-12 flex-1 min-w-[150px] items-center justify-center rounded-[12px] border-[1.5px] border-[#E7E5E1] bg-card px-5 text-[14.5px] font-semibold text-foreground transition-colors hover:bg-[#F7F7F5] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(20,184,166,0.4)]"
          >
            Quitter sans enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
