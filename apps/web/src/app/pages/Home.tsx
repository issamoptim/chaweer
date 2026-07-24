import { LandingHeader } from "@/features/public/components/LandingHeader";
import { LandingHero } from "@/features/public/components/LandingHero";
import { DomainFilterBar } from "@/features/public/components/DomainFilterBar";
import { LawyerGrid } from "@/features/public/components/LawyerGrid";
import { HowItWorks } from "@/features/public/components/HowItWorks";
import { LandingFooter } from "@/features/public/components/LandingFooter";
import { useLawyerFilter } from "@/features/public/hooks/useLawyerFilter";
import { MOCK_LAWYERS } from "@/features/public/data/mockLawyers";

export function Home() {
  const {
    selectedDomains,
    city,
    query,
    filteredLawyers,
    filteredCount,
    toggleDomain,
    selectAllDomains,
    setCity,
    setQuery,
  } = useLawyerFilter(MOCK_LAWYERS);

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F7F5]">
      <LandingHeader />
      <LandingHero
        city={city}
        query={query}
        filteredCount={filteredCount}
        onCityChange={setCity}
        onQueryChange={setQuery}
      />
      <DomainFilterBar
        selectedDomains={selectedDomains}
        onToggleDomain={toggleDomain}
        onSelectAll={selectAllDomains}
      />
      <LawyerGrid lawyers={filteredLawyers} />
      <HowItWorks />
      <LandingFooter />
    </div>
  );
}
