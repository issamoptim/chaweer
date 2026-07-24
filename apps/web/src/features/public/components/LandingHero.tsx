import { useTranslation } from "react-i18next";
import type { PublicReferentialItem } from "@/features/public/types/lawyer";

interface LandingHeroProps {
  city: string;
  query: string;
  filteredCount: number;
  cities: PublicReferentialItem[];
  onCityChange: (city: string) => void;
  onQueryChange: (query: string) => void;
}

export function LandingHero({
  city,
  query,
  filteredCount,
  cities,
  onCityChange,
  onQueryChange,
}: LandingHeroProps) {
  const { t } = useTranslation();

  return (
    <section
      className="px-5 pb-6 pt-7 sm:px-12"
      style={{
        background: "linear-gradient(150deg, #082E2A 0%, #0F4A44 100%)",
      }}
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="max-w-[640px]">
          <h1
            className="m-0 mb-2 text-[36px] font-extrabold leading-[1.15] text-white"
            style={{ letterSpacing: "-0.025em", textWrap: "balance" }}
          >
            {t("landing.hero.title")}
            <br />
            {t("landing.hero.titleLine2")}
          </h1>
          <p
            className="m-0 mb-5 text-[15px] leading-[1.5]"
            style={{ color: "rgba(255,255,255,.65)" }}
          >
            {t("landing.hero.subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* City select */}
          <div className="relative" style={{ flex: "0 1 220px" }}>
            <select
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              className="h-[46px] w-full cursor-pointer appearance-none rounded-[10px] border-none bg-white pl-3.5 pr-9 text-sm font-semibold text-foreground outline-none shadow-input-landing"
              aria-label={t("landing.hero.search.cityPlaceholder")}
            >
              <option value="">
                {t("landing.hero.search.cityPlaceholder")}
              </option>
              {cities.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9A968E"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>

          {/* Search input */}
          <div className="relative min-w-[260px] flex-1">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9A968E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={t("landing.hero.search.queryPlaceholder")}
              className="h-[46px] w-full rounded-[10px] border-none bg-white pl-10 pr-3.5 text-sm outline-none shadow-input-landing"
            />
          </div>

          {/* Result count */}
          <div
            className="whitespace-nowrap text-[13px]"
            style={{ color: "rgba(255,255,255,.55)" }}
          >
            {t("landing.hero.search.resultsCount", {
              count: filteredCount,
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
