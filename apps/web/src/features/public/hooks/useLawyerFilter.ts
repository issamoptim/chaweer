import { useMemo, useState, useCallback } from "react";
import type { Lawyer, DomainKey } from "@/features/public/types/lawyer";

interface FilterState {
  selectedDomains: DomainKey[];
  city: string;
  query: string;
}

interface UseLawyerFilterReturn {
  selectedDomains: DomainKey[];
  city: string;
  query: string;
  filteredLawyers: Lawyer[];
  filteredCount: number;
  toggleDomain: (domain: DomainKey) => void;
  selectAllDomains: () => void;
  setCity: (city: string) => void;
  setQuery: (query: string) => void;
}

export function useLawyerFilter(lawyers: Lawyer[]): UseLawyerFilterReturn {
  const [selectedDomains, setSelectedDomains] = useState<DomainKey[]>([]);
  const [city, setCity] = useState("");
  const [query, setQuery] = useState("");

  const toggleDomain = useCallback((domain: DomainKey) => {
    setSelectedDomains((prev) =>
      prev.includes(domain)
        ? prev.filter((d) => d !== domain)
        : [...prev, domain],
    );
  }, []);

  const selectAllDomains = useCallback(() => {
    setSelectedDomains([]);
  }, []);

  const filteredLawyers = useMemo(() => {
    let filtered = lawyers;

    if (selectedDomains.length > 0) {
      filtered = filtered.filter((l) =>
        l.domains.some((d) => selectedDomains.includes(d)),
      );
    }

    if (city) {
      filtered = filtered.filter((l) => l.ville === city);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter(
        (l) =>
          l.nom.toLowerCase().includes(q) ||
          l.specs.some((s) => s.toLowerCase().includes(q)),
      );
    }

    return filtered;
  }, [lawyers, selectedDomains, city, query]);

  return {
    selectedDomains,
    city,
    query,
    filteredLawyers,
    filteredCount: filteredLawyers.length,
    toggleDomain,
    selectAllDomains,
    setCity,
    setQuery,
  };
}
