import { useTranslation } from "react-i18next";
import { DOMAINS } from "@/features/public/data/domains";
import type { DomainKey } from "@/features/public/types/lawyer";

interface DomainFilterBarProps {
  selectedDomains: DomainKey[];
  onToggleDomain: (domain: DomainKey) => void;
  onSelectAll: () => void;
}

export function DomainFilterBar({
  selectedDomains,
  onToggleDomain,
  onSelectAll,
}: DomainFilterBarProps) {
  const { t } = useTranslation();
  const allActive = selectedDomains.length === 0;

  const chipBase =
    "rounded-[20px] px-3.5 py-[7px] text-[13px] font-semibold whitespace-nowrap flex-shrink-0 cursor-pointer border-none transition-colors duration-150";

  return (
    <section
      className="sticky top-[58px] z-20 border-b border-[#EFEDE9] bg-white"
    >
      <div className="hide-scrollbar overflow-x-auto">
        <div
          className="flex min-w-max items-center gap-1.5 px-12 py-2.5"
        >
          <button
            onClick={onSelectAll}
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
          {DOMAINS.map((d) => {
            const isActive = selectedDomains.includes(d.key);
            return (
              <button
                key={d.key}
                onClick={() => onToggleDomain(d.key)}
                role="switch"
                aria-checked={isActive}
                className={
                  isActive
                    ? `${chipBase} bg-primary text-white`
                    : `${chipBase} bg-transparent text-[#4B4A46]`
                }
              >
                {t(d.labelKey)}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
