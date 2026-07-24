import { useTranslation } from "react-i18next";
import type { PublicReferentialItem } from "@/features/public/types/lawyer";

interface DomainFilterBarProps {
  specializations: PublicReferentialItem[];
  selectedSpecializations: string[];
  onToggleSpecialization: (key: string) => void;
  onClearAll: () => void;
}

export function DomainFilterBar({
  specializations,
  selectedSpecializations,
  onToggleSpecialization,
  onClearAll,
}: DomainFilterBarProps) {
  const { t } = useTranslation();
  const allActive = selectedSpecializations.length === 0;

  const chipBase =
    "rounded-[20px] px-3.5 py-[7px] text-[13px] font-semibold whitespace-nowrap flex-shrink-0 cursor-pointer border-none transition-colors duration-150";

  return (
    <section className="sticky top-[58px] z-20 border-b border-[#EFEDE9] bg-white">
      <div className="hide-scrollbar overflow-x-auto">
        <div className="flex min-w-max items-center gap-1.5 px-5 py-2.5 sm:px-8 lg:px-12">
          <button
            onClick={onClearAll}
            role="switch"
            aria-checked={allActive}
            className={
              allActive
                ? `${chipBase} bg-primary text-white`
                : `${chipBase} bg-transparent text-[#4B4A46]`
            }
          >
            {t("landing.filters.all")}
          </button>
          {specializations.map((spec) => {
            const isActive = selectedSpecializations.includes(spec.key);
            return (
              <button
                key={spec.id}
                onClick={() => onToggleSpecialization(spec.key)}
                role="switch"
                aria-checked={isActive}
                className={
                  isActive
                    ? `${chipBase} bg-primary text-white`
                    : `${chipBase} bg-transparent text-[#4B4A46]`
                }
              >
                {spec.name}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
