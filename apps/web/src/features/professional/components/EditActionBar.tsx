import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface EditActionBarProps {
  isEditing: boolean;
  isSaving: boolean;
  canSave: boolean;
  onSave: () => void;
  onCancel: () => void;
  status?: ReactNode;
}

export function EditActionBar({
  isEditing,
  isSaving,
  canSave,
  onSave,
  onCancel,
  status,
}: EditActionBarProps) {
  if (!isEditing) return null;

  return (
    <div className="sticky bottom-0 z-10 -mx-6 mt-8 border-t border-[#EFEDE9] bg-[#F7F7F5]/95 px-6 py-4 backdrop-blur sm:-mx-8 sm:px-8">
      <div className="mx-auto flex max-w-[860px] items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[13.5px] text-[#6B6862]">
          {status}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="flex h-[42px] items-center rounded-[10px] border-[1.5px] border-[#E7E5E1] bg-white px-5 text-[14px] font-semibold text-[#4B4842] transition-colors hover:bg-[#F0EEEA] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(20,184,166,0.35)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!canSave || isSaving}
            className="flex h-[42px] items-center gap-2 rounded-[10px] bg-[#0F766E] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#134E4A] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(20,184,166,0.35)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Enregistrement…
              </>
            ) : (
              <>
                Enregistrer
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
