import { BadgeCheck, Video, MapPin, Clock } from "lucide-react";
import { resolveMediaUrl } from "@/utils/media-url";
import type { ConsultationModality } from "../types/professional-types";

interface OfferPreviewCardProps {
  name: string;
  city: string | null;
  specialties: string[];
  price: number | null;
  durationMinutes: number | null;
  modalities: ConsultationModality[];
  photoUrl: string | null;
}

export function OfferPreviewCard({
  name,
  city,
  specialties,
  price,
  durationMinutes,
  modalities,
  photoUrl,
}: OfferPreviewCardProps) {
  return (
    <div className="rounded-[16px] border border-[#E9E7E3] bg-white p-5 shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)]">
      <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-wide text-[#9A968E]">
        Aperçu client
      </p>
      <div className="flex items-start gap-3">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E6F2F0] text-[18px] font-bold text-[#0F766E]">
          {photoUrl ? (
            <img src={resolveMediaUrl(photoUrl) ?? undefined} alt="" className="h-full w-full object-cover" />
          ) : (
            (name || "?").charAt(0).toUpperCase()
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[16px] font-bold text-[#1C1B1A]">
              {name || "Votre nom"}
            </span>
            <BadgeCheck className="h-4 w-4 shrink-0 text-[#0F766E]" aria-hidden="true" />
          </div>
          {city && (
            <p className="mt-0.5 flex items-center gap-1 text-[13px] text-[#6B6862]">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {city}
            </p>
          )}
        </div>
      </div>

      {specialties.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {specialties.slice(0, 3).map((spec) => (
            <span
              key={spec}
              className="rounded-full bg-[#F0EEEA] px-2.5 py-1 text-[11.5px] font-medium text-[#4B4842]"
            >
              {spec}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-end justify-between border-t border-[#EFEDE9] pt-4">
        <div>
          <p className="text-[22px] font-bold text-[#1C1B1A]">
            {price && price > 0 ? `${price} DH` : "— DH"}
          </p>
          {durationMinutes && (
            <p className="mt-0.5 flex items-center gap-1 text-[12.5px] text-[#6B6862]">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {durationMinutes} min
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 text-[#6B6862]">
          {modalities.includes("VIDEO") && (
            <span className="flex items-center gap-1 text-[12px]">
              <Video className="h-4 w-4" aria-hidden="true" />
              Vidéo
            </span>
          )}
          {modalities.includes("OFFICE") && (
            <span className="flex items-center gap-1 text-[12px]">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Cabinet
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
