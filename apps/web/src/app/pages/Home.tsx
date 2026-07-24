import { useQuery } from "@tanstack/react-query";
import { LandingHeader } from "@/features/public/components/LandingHeader";
import { LandingHero } from "@/features/public/components/LandingHero";
import { DomainFilterBar } from "@/features/public/components/DomainFilterBar";
import { LawyerGrid } from "@/features/public/components/LawyerGrid";
import { HowItWorks } from "@/features/public/components/HowItWorks";
import { LandingFooter } from "@/features/public/components/LandingFooter";
import { Pagination } from "@/features/public/components/Pagination";
import { useLawyerFilter } from "@/features/public/hooks/useLawyerFilter";
import { publicService } from "@/features/public/services/public-service";

const PAGE_SIZE = 20;

export function Home() {
  const { data: referential } = useQuery({
    queryKey: ["public-referential"],
    queryFn: () => publicService.getReferential(),
  });

  const {
    selectedSpecializations,
    city,
    query,
    page,
    toggleSpecialization,
    clearSpecializations,
    setCity,
    setQuery,
    setPage,
  } = useLawyerFilter();

  const { data: professionalsData, isLoading } = useQuery({
    queryKey: ["public-professionals", selectedSpecializations, city, query, page],
    queryFn: () =>
      publicService.listProfessionals({
        specializations: selectedSpecializations.length > 0 ? selectedSpecializations : undefined,
        city: city || undefined,
        q: query.trim() || undefined,
        page,
        limit: PAGE_SIZE,
      }),
  });

  const lawyers = professionalsData?.professionals ?? [];
  const specializations = referential?.specializations ?? [];
  const cities = referential?.cities ?? [];
  const total = professionalsData?.total ?? 0;
  const totalPages = professionalsData?.totalPages ?? 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    document.getElementById("avocats")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F7F5]">
      <LandingHeader />
      <LandingHero
        city={city}
        query={query}
        filteredCount={total}
        cities={cities}
        onCityChange={setCity}
        onQueryChange={setQuery}
      />
      <DomainFilterBar
        specializations={specializations}
        selectedSpecializations={selectedSpecializations}
        onToggleSpecialization={toggleSpecialization}
        onClearAll={clearSpecializations}
      />
      <LawyerGrid lawyers={lawyers} isLoading={isLoading} />
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      <HowItWorks />
      <LandingFooter />
    </div>
  );
}
