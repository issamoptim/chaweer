export type ConsultationModality = "VIDEO" | "AUDIO" | "CHAT";

export interface ReferentialItem {
  id: string;
  key: string;
  name: string;
}

export interface LanguageItem {
  id: string;
  code: string;
  name: string;
}

export interface SpecializationItem extends ReferentialItem {
  practiceAreas: ReferentialItem[];
}

export interface Referential {
  specializations: SpecializationItem[];
  languages: LanguageItem[];
  barAssociations: ReferentialItem[];
  cities: ReferentialItem[];
}

export interface IdentityData {
  firstName: string;
  lastName: string;
  professionalTitle: string | null;
  photoUrl: string | null;
  barAssociationId: string | null;
}

export interface BiographyData {
  bio: string | null;
}

export interface ContactData {
  phone: string | null;
  whatsapp: string | null;
  publicEmail: string | null;
  website: string | null;
  linkedInUrl: string | null;
}

export interface OfficeData {
  name: string | null;
  address: string | null;
  cityId: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface ExpertiseData {
  specializationIds: string[];
  practiceAreaIds: string[];
  languageIds: string[];
}

export interface ConsultationOfferData {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  durationMinutes: number;
  modalities: ConsultationModality[];
  active: boolean;
  order: number;
}

export interface ProfileCompletionSections {
  identity: boolean;
  biography: boolean;
  contact: boolean;
  office: boolean;
  expertise: boolean;
  offer: boolean;
  education: boolean;
  experience: boolean;
  certifications: boolean;
  memberships: boolean;
}

export interface ProfileCompletion {
  percentage: number;
  completedSections: number;
  totalSections: number;
  sections: ProfileCompletionSections;
}

export interface ProfessionalProfileData {
  id: string;
  status: string;
  publishedAt: string | null;
  unpublishedAt: string | null;
  identity: IdentityData;
  biography: BiographyData;
  contact: ContactData | null;
  office: OfficeData | null;
  expertise: ExpertiseData;
  offers: ConsultationOfferData[];
  education: unknown[];
  experience: unknown[];
  certifications: unknown[];
  memberships: unknown[];
  verification: { status: string; verifiedAt: string | null; rejectionReason: string | null } | null;
  completion: ProfileCompletion;
}

export interface UpdateProfileResponseData {
  id: string;
  status: string;
  publishedAt: string | null;
  identity: IdentityData;
  biography: BiographyData;
}

export interface UpdateProfessionalProfileInput {
  firstName?: string;
  lastName?: string;
  professionalTitle?: string | null;
  photoUrl?: string | null;
  barAssociationId?: string | null;
  bio?: string | null;
}

export interface UpdateExpertiseInput {
  specializationIds: string[];
  practiceAreaIds: string[];
  languageIds: string[];
}

export interface UpdateOfferInput {
  title: string;
  description: string;
  price: number;
  modalities: ConsultationModality[];
}

export interface UpdateContactInput {
  phone?: string | null;
  whatsapp?: string | null;
  publicEmail?: string | null;
  website?: string | null;
  linkedInUrl?: string | null;
}

export interface UpdateOfficeInput {
  name?: string | null;
  address?: string | null;
  cityId?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}
