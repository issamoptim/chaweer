import { useTranslation } from "react-i18next";
import type { PublicListProfessional, ConsultationMode } from "@/features/public/types/lawyer";
import { resolveMediaUrl } from "@/utils/media-url";
import { ICON_PATHS, MODE_LABEL_KEYS } from "./ModeIcons";

interface LawyerCardProps {
  lawyer: PublicListProfessional;
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
}

function formatPrice(price: number, currency: string): string {
  if (currency === "MAD") return `${price} DH`;
  return `${price} ${currency}`;
}

export function LawyerCard({ lawyer }: LawyerCardProps) {
  const { t } = useTranslation();
  const hasPhoto = !!lawyer.photoUrl;
  const photoUrl = resolveMediaUrl(lawyer.photoUrl);
  const fullName = `${lawyer.firstName} ${lawyer.lastName}`;

  const visibleSpecs = lawyer.specializationNames.slice(0, 2);
  const extraSpecsCount =
    lawyer.specializationNames.length > 2
      ? lawyer.specializationNames.length - 2
      : 0;

  const allModalities = lawyer.offers.flatMap((o) => o.modalities);
  const uniqueModalities = [...new Set(allModalities)] as ConsultationMode[];

  const firstOffer = lawyer.offers[0];

  return (
    <a
      href={`/avocat/${lawyer.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#E9E7E3] bg-white no-underline text-inherit shadow-card-landing transition-all duration-150 hover:border-primary hover:shadow-card-landing-hover"
      style={{ transform: "translateY(0)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Photo zone */}
      <div
        className="relative flex h-[230px] flex-shrink-0 items-center justify-center overflow-hidden"
        style={{
          background: hasPhoto
            ? undefined
            : "linear-gradient(135deg, #0D4A44, #0F766E)",
        }}
      >
        {hasPhoto ? (
          <img
            src={photoUrl!}
            alt={fullName}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <span
            className="select-none text-[56px] font-extrabold"
            style={{ color: "rgba(255,255,255,.2)" }}
          >
            {getInitials(lawyer.firstName, lawyer.lastName)}
          </span>
        )}

        {/* Gradient bottom with name + city */}
        <div
          className="absolute bottom-0 left-0 right-0 pt-4 pb-3 px-4"
          style={{
            background:
              "linear-gradient(to top, rgba(8,46,42,.8), transparent)",
          }}
        >
          <div
            className="text-[15px] font-extrabold text-white"
            style={{ letterSpacing: "-0.01em" }}
          >
            {fullName}
          </div>
          {lawyer.cityName && (
            <div
              className="mt-[1px] text-xs"
              style={{ color: "rgba(255,255,255,.75)" }}
            >
              {lawyer.cityName}
            </div>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-3 px-5 pb-4 pt-5">
        {/* Specialties */}
        {visibleSpecs.length > 0 && (
          <div className="flex flex-wrap gap-[5px]">
            {visibleSpecs.map((spec) => (
              <span
                key={spec}
                className="whitespace-nowrap rounded-[7px] bg-[#EAF6F4] px-[9px] py-[3px] text-[11.5px] font-semibold text-primary"
              >
                {spec}
              </span>
            ))}
            {extraSpecsCount > 0 && (
              <span className="whitespace-nowrap rounded-[7px] bg-[#F4F3F0] px-[9px] py-[3px] text-[11.5px] font-semibold text-text-faint">
                {t("landing.card.specsMore", { count: extraSpecsCount })}
              </span>
            )}
          </div>
        )}

        {/* Modalities */}
        {uniqueModalities.length > 0 && (
          <div className="flex flex-wrap items-center gap-[7px] text-xs text-text-faint">
            {uniqueModalities.map((mode) => (
              <span
                key={mode}
                className="inline-flex items-center gap-[3px] whitespace-nowrap"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {ICON_PATHS[mode]}
                </svg>
                {t(MODE_LABEL_KEYS[mode])}
              </span>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between gap-2">
          {firstOffer ? (
            <div>
              <div
                className="text-[22px] font-extrabold leading-none text-primary"
                style={{ letterSpacing: "-0.02em" }}
              >
                {formatPrice(firstOffer.price, firstOffer.currency)}
              </div>
              <div className="text-[11px] text-text-faint">
                {t("landing.card.perConsultation")}
              </div>
            </div>
          ) : (
            <div />
          )}
          <div className="flex-shrink-0 whitespace-nowrap rounded-[9px] bg-primary px-4 py-2.5 text-[13px] font-bold text-white transition-colors group-hover:bg-primary-hover">
            {t("landing.card.consult")}
          </div>
        </div>
      </div>
    </a>
  );
}
