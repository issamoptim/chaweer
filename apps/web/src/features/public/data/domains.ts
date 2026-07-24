import type { DomainKey } from "@/features/public/types/lawyer";

export interface Domain {
  key: DomainKey;
  labelKey: string;
}

export const DOMAINS: Domain[] = [
  { key: "travail", labelKey: "landing.filters.domains.travail" },
  { key: "famille", labelKey: "landing.filters.domains.famille" },
  { key: "immobilier", labelKey: "landing.filters.domains.immobilier" },
  { key: "affaires", labelKey: "landing.filters.domains.affaires" },
  { key: "penal", labelKey: "landing.filters.domains.penal" },
  { key: "fiscal", labelKey: "landing.filters.domains.fiscal" },
  { key: "administratif", labelKey: "landing.filters.domains.administratif" },
  { key: "consommation", labelKey: "landing.filters.domains.consommation" },
  { key: "etrangers", labelKey: "landing.filters.domains.etrangers" },
  { key: "societes", labelKey: "landing.filters.domains.societes" },
  { key: "bancaire", labelKey: "landing.filters.domains.bancaire" },
  { key: "numerique", labelKey: "landing.filters.domains.numerique" },
];

export const CITIES: string[] = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Tanger",
  "Fès",
  "Agadir",
];
