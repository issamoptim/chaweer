import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { LoadingSpinner } from "@/features/auth";
import { useDeleteAccount } from "../hooks/useDeleteAccount";

interface DeleteAccountConfirmModalProps {
  open: boolean;
  onClose: () => void;
}

export function DeleteAccountConfirmModal({ open, onClose }: DeleteAccountConfirmModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();
  const toast = useToast();

  const mutation = useDeleteAccount({
    onSuccess: () => {
      logout();
      navigate("/connexion");
    },
    onError: (message) => {
      toast.showError(message);
    },
  });

  useEffect(() => {
    if (!open) return;

    previousFocus.current = document.activeElement as HTMLElement;
    dialogRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (!mutation.isPending) {
          onClose();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus.current?.focus();
    };
  }, [open, onClose, mutation.isPending]);

  if (!open) return null;

  const isDeleting = mutation.isPending;

  function handleConfirm() {
    if (!accessToken) return;
    mutation.mutate(accessToken);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(28,27,26,0.42)] p-4"
      onClick={() => {
        if (!isDeleting) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-account-confirm-title"
        tabIndex={-1}
        className="w-full max-w-[400px] rounded-[16px] border border-[#E9E7E3] bg-card p-7 shadow-[0_20px_50px_rgba(19,78,74,0.24)] focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FBEAE9]">
            <Trash2 className="h-5 w-5 text-[#B4231F]" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="delete-account-confirm-title"
              className="text-[19px] font-bold text-foreground"
            >
              Supprimer votre compte ?
            </h2>
          </div>
        </div>

        <div className="mb-6 space-y-2 text-[14px] text-[#6B6862]">
          <p>
            La suppression de votre compte est définitive. Toutes vos données seront supprimées et
            cette action ne peut pas être annulée.
          </p>
        </div>

        <div className="flex flex-row flex-wrap gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex h-12 flex-1 min-w-[120px] items-center justify-center rounded-[12px] border-[1.5px] border-[#E7E5E1] bg-card px-5 text-[14.5px] font-semibold text-foreground transition-colors hover:bg-[#F7F7F5] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(20,184,166,0.40)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex h-12 flex-1 min-w-[120px] items-center justify-center gap-2 rounded-[12px] bg-[#B4231F] px-5 text-[14.5px] font-semibold text-white transition-colors hover:bg-[#8F1B18] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(180,35,31,0.28)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting && <LoadingSpinner size="sm" className="text-white" />}
            {isDeleting ? "Suppression…" : "Supprimer définitivement"}
          </button>
        </div>
      </div>
    </div>
  );
}
