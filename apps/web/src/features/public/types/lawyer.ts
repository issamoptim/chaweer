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
  photoUrl: string;
  specs: string[];
  domains: DomainKey[];
  rating: string;
  reviews: string;
  prix: string;
  modes: string[];
  experience: string;
  responseTime: string;
  verified: boolean;
}

export type ConsultationMode = "VIDEO" | "AUDIO" | "CHAT";

export interface PublicOffer {
  id: string;
  title: string;
  price: number;
  currency: string;
  modalities: ConsultationMode[];
}

export interface PublicListProfessional {
  id: string;
  firstName: string;
  lastName: string;
  professionalTitle: string | null;
  photoUrl: string | null;
  yearsOfExperience: number | null;
  cityName: string | null;
  specializationNames: string[];
  practiceAreaNames: string[];
  offers: PublicOffer[];
  barAssociationName: string | null;
}

export interface PublicReferentialItem {
  id: string;
  key: string;
  name: string;
}

export interface PublicReferential {
  specializations: PublicReferentialItem[];
  cities: PublicReferentialItem[];
}

export interface PublicListResponse {
  professionals: PublicListProfessional[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
