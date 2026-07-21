import type { ConsultationModality } from "../enums/consultation-modality.enum";

// ============================================================
// GET /professionals/:id — public profile
// ============================================================

export interface PublicIdentityResponse {
  firstName: string;
  lastName: string;
  professionalTitle: string | null;
  photoUrl: string | null;
}

export interface PublicBarAssociationResponse {
  id: string;
  name: string;
}

export interface PublicCityResponse {
  id: string;
  name: string;
}

export interface PublicOfficeResponse {
  name: string | null;
  address: string | null;
  city: PublicCityResponse | null;
  googleMapsUrl: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface PublicExpertiseResponse {
  specializations: { id: string; name: string }[];
  practiceAreas: { id: string; name: string }[];
  languages: { id: string; name: string }[];
}

export interface PublicOfferResponse {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  durationMinutes: number;
  modalities: ConsultationModality[];
}

export interface PublicProfileResponse {
  id: string;
  identity: PublicIdentityResponse;
  biography: { bio: string | null };
  barAssociation: PublicBarAssociationResponse | null;
  office: PublicOfficeResponse | null;
  expertise: PublicExpertiseResponse;
  offers: PublicOfferResponse[];
  education: {
    id: string;
    degree: string;
    institution: string;
    startYear: number;
    endYear: number | null;
    description: string | null;
    order: number;
  }[];
  experience: {
    id: string;
    position: string;
    organization: string;
    startYear: number;
    endYear: number | null;
    current: boolean;
    description: string | null;
    order: number;
  }[];
  certifications: {
    id: string;
    title: string;
    issuer: string;
    issueYear: number;
    expiryYear: number | null;
    credentialId: string | null;
    order: number;
  }[];
  isVerified: boolean;
}
