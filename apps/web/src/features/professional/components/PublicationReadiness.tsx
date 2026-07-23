import { useState } from "react";
import { Check, X, Rocket, Globe, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { PrimaryButton } from "@/features/auth";
import { useToast } from "@/hooks/useToast";
import { useProfessionalProfile } from "../hooks/useProfessionalProfile";
import { usePublishProfile } from "../hooks/usePublishProfile";
import { evaluatePublicationReadiness } from "../utils/publication-readiness";
import type { ApiError } from "@/features/auth/types/auth-types";

export function PublicationReadiness() {
  const toast = useToast();
  const { data: profile } = useProfessionalProfile();
  const mutation = usePublishProfile();
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  const [showMissingList, setShowMissingList] = useState(false);

  const readiness = evaluatePublicationReadiness(profile);
  const isPublished = profile?.status === "PUBLISHED";
  const percentage = Math.round((readiness.completedCount / readiness.totalCount) * 100);
  const missingItems = readiness.checklist.filter((c) => !c.done);

  function handlePublish() {
    if (!readiness.isReady) {
      setShowMissingList(true);
      return;
    }
    mutation.mutate(undefined, {
      onSuccess: () => {
        toast.showSuccess("Votre profil est maintenant en ligne.");
        setShowErrorDetails(false);
      },
      onError: (error: ApiError) => {
        if (error.missingRequirements && error.missingRequirements.length > 0) {
          setShowErrorDetails(true);
          toast.showError("Critères de publication manquants.");
        } else {
          toast.showError("Impossible de publier votre profil.");
        }
      },
    });
  }

  return (
    <div className="mb-6 rounded-[16px] border border-[#E9E7E3] bg-white p-5 shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)]">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              isPublished
                ? "bg-[#E6F2F0] text-[#0F766E]"
                : readiness.isReady
                  ? "bg-[#E6F2F0] text-[#0F766E]"
                  : "bg-[#F5F0E8] text-[#9A7B3F]"
            }`}
          >
            {isPublished ? (
              <Globe className="h-5 w-5" />
            ) : (
              <Rocket className="h-5 w-5" />
            )}
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-[#1C1B1A]">
              {isPublished ? "Profil publié" : "Publication du profil"}
            </h2>
            <p className="text-[13px] text-[#6B6862]">
              {isPublished
                ? "Votre profil est visible sur la plateforme."
                : `${readiness.completedCount}/${readiness.totalCount} critères remplis — ${percentage}%`}
            </p>
          </div>
        </div>

        {/* Status badge */}
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold ${
            isPublished
              ? "bg-[#E6F2F0] text-[#0F766E]"
              : "bg-[#F0EEEA] text-[#6B6862]"
          }`}
        >
          {isPublished ? (
            <>
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
              En ligne
            </>
          ) : (
            "Brouillon"
          )}
        </span>
      </div>

      {/* Published date */}
      {isPublished && profile?.publishedAt && (
        <p className="mt-3 text-[12.5px] text-[#6B6862]">
          Publié le{" "}
          {new Date(profile.publishedAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      )}

      {/* Checklist (only when not published) */}
      {!isPublished && (
        <>
          {/* Progress bar */}
          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#F0EEEA]">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  readiness.isReady ? "bg-[#0F766E]" : "bg-[#9A7B3F]"
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Missing requirements guidance (P6: guide, don't block) */}
          {!readiness.isReady && (
            <div className="mt-4 rounded-[10px] border border-[#F0E6D0] bg-[#FDF8EE] px-4 py-3">
              <button
                type="button"
                onClick={() => setShowMissingList((v) => !v)}
                className="flex w-full items-center justify-between text-left"
                aria-expanded={showMissingList}
              >
                <span className="text-[13px] font-semibold text-[#9A7B3F]">
                  {missingItems.length} critère{missingItems.length > 1 ? "s" : ""} manquant{missingItems.length > 1 ? "s" : ""} pour la publication
                </span>
                {showMissingList ? (
                  <ChevronUp className="h-4 w-4 text-[#9A7B3F]" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-[#9A7B3F]" aria-hidden="true" />
                )}
              </button>
              {showMissingList && (
                <ul className="mt-2 flex flex-col gap-1.5">
                  {missingItems.map((item) => (
                    <li key={item.key} className="flex items-center gap-2 text-[12.5px] text-[#6B6862]">
                      <X className="h-3 w-3 shrink-0 text-[#C54545]" strokeWidth={3} />
                      {item.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Full checklist grid */}
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {readiness.checklist.map((item) => (
              <div
                key={item.key}
                className="flex items-center gap-2 text-[13px]"
              >
                <span
                  className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${
                    item.done
                      ? "bg-[#0F766E] text-white"
                      : "border border-[#D9D6D0] bg-white text-[#B4AFA6]"
                  }`}
                >
                  {item.done ? (
                    <Check className="h-3 w-3" strokeWidth={3} />
                  ) : (
                    <X className="h-2.5 w-2.5" strokeWidth={3} />
                  )}
                </span>
                <span
                  className={
                    item.done
                      ? "font-medium text-[#1C1B1A]"
                      : "text-[#9A968E]"
                  }
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Server error details */}
          {showErrorDetails &&
            mutation.error?.missingRequirements &&
            mutation.error.missingRequirements.length > 0 && (
              <div className="mt-4 flex items-start gap-2.5 rounded-[10px] border border-[#F0D5D5] bg-[#FDF6F6] px-4 py-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#C54545]" />
                <div>
                  <p className="text-[13px] font-semibold text-[#C54545]">
                    Le serveur a refusé la publication
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-[#6B6862]">
                    Critères manquants :{" "}
                    {mutation.error.missingRequirements.join(", ")}
                  </p>
                </div>
              </div>
            )}

          {/* Publish button — P6: never silently disabled, always clickable */}
          <div className="mt-5 flex items-center justify-end gap-3">
            <PrimaryButton
              type="button"
              onClick={handlePublish}
              loading={mutation.isPending}
              disabled={mutation.isPending}
              className="w-auto px-6"
            >
              <Rocket className="h-4 w-4" aria-hidden="true" />
              Publier mon profil
            </PrimaryButton>
          </div>
        </>
      )}
    </div>
  );
}
