import { useTranslation } from "react-i18next";
import type { PublicListProfessional } from "@/features/public/types/lawyer";
import { LawyerCard } from "./LawyerCard";

interface LawyerGridProps {
  lawyers: PublicListProfessional[];
  isLoading?: boolean;
}

export function LawyerGrid({ lawyers, isLoading }: LawyerGridProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <section
        id="avocats"
        className="mx-auto max-w-[1400px] px-12 pb-20 pt-8 sm:px-20 lg:px-28"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-2xl border border-[#E9E7E3] bg-white"
            >
              <div className="h-[230px] bg-[#E9E7E3]" />
              <div className="space-y-2 p-4">
                <div className="h-4 w-2/3 rounded bg-[#E9E7E3]" />
                <div className="h-3 w-1/2 rounded bg-[#E9E7E3]" />
                <div className="h-3 w-3/4 rounded bg-[#E9E7E3]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (lawyers.length === 0) {
    return (
      <section
        id="avocats"
        className="mx-auto max-w-[1400px] px-12 pb-20 pt-8 sm:px-20 lg:px-28"
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
      className="mx-auto max-w-[1400px] px-12 pb-20 pt-8 sm:px-20 lg:px-28"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {lawyers.map((lawyer) => (
          <LawyerCard key={lawyer.id} lawyer={lawyer} />
        ))}
      </div>
    </section>
  );
}
