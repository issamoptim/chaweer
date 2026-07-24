import { useState, useCallback } from "react";

interface UseLawyerFilterReturn {
  selectedSpecializations: string[];
  city: string;
  query: string;
  page: number;
  toggleSpecialization: (key: string) => void;
  clearSpecializations: () => void;
  setCity: (city: string) => void;
  setQuery: (query: string) => void;
  setPage: (page: number) => void;
}

export function useLawyerFilter(): UseLawyerFilterReturn {
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [city, setCity] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const clearSpecializations = useCallback(() => {
    setSelectedSpecializations([]);
    setPage(1);
  }, []);

  const handleSetCity = useCallback((c: string) => {
    setCity(c);
    setPage(1);
  }, []);

  const handleSetQuery = useCallback((q: string) => {
    setQuery(q);
    setPage(1);
  }, []);

  const handleToggleSpecialization = useCallback((key: string) => {
    setSelectedSpecializations((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key],
    );
    setPage(1);
  }, []);

  return {
    selectedSpecializations,
    city,
    query,
    page,
    toggleSpecialization: handleToggleSpecialization,
    clearSpecializations,
    setCity: handleSetCity,
    setQuery: handleSetQuery,
    setPage,
  };
}
