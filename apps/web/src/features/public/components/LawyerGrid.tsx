import { useTranslation } from "react-i18next";
import type { Lawyer } from "@/features/public/types/lawyer";
import { LawyerCard } from "./LawyerCard";

interface LawyerGridProps {
  lawyers: Lawyer[];
}

export function LawyerGrid({ lawyers }: LawyerGridProps) {
  const { t } = useTranslation();

  if (lawyers.length === 0) {
    return (
      <section
        id="avocats"
        className="mx-auto max-w-[1060px] px-5 pb-20 pt-5 sm:px-12"
      >
        <div className="px-6 py-15 text-center">
          <div className="mb-3 text-[36px]">🔍</div>
          <div className="text-base font-bold text-foreground">
            {t("landing.empty.title")}
          </div>
          <div className="mt-1.5 text-sm text-text-faint">
            {t("landing.empty.subtitle")}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="avocats"
      className="mx-auto max-w-[1060px] px-5 pb-20 pt-5 sm:px-12"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {lawyers.map((lawyer) => (
          <LawyerCard key={lawyer.id} lawyer={lawyer} />
        ))}
      </div>
    </section>
  );
}
