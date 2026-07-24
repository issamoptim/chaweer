export type ConsultationMode = "Vidéo" | "Audio" | "Cabinet" | "Chat";

export type DomainKey =
  | "travail"
  | "famille"
  | "immobilier"
  | "affaires"
  | "penal"
  | "fiscal"
  | "administratif"
  | "consommation"
  | "etrangers"
  | "societes"
  | "bancaire"
  | "numerique";

export interface Lawyer {
  id: string;
  nom: string;
  ville: string;
  photoUrl?: string;
  specs: string[];
  domains: DomainKey[];
  modes: ConsultationMode[];
  prix: string;
  rating: string;
  reviews: string;
  experience: string;
  responseTime: string;
  verified: boolean;
}
