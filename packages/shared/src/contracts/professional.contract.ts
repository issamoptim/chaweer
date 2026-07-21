import type { ProfessionalProfileStatus } from "../enums/professional-status.enum";
import type { ConsultationModality } from "../enums/consultation-modality.enum";
import type { VerificationStatus } from "../enums/verification-status.enum";

// ============================================================
// Response types for GET /professional/me
// ============================================================

export interface IdentityResponse {
  firstName: string;
  lastName: string;
  professionalTitle: string | null;
  photoUrl: string | null;
  barAssociationId: string | null;
}

export interface BiographyResponse {
  bio: string | null;
}

export interface ContactResponse {
  phone: string | null;
  whatsapp: string | null;
  publicEmail: string | null;
  website: string | null;
  linkedInUrl: string | null;
}

export interface OfficeResponse {
  name: string | null;
  address: string | null;
  cityId: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface ExpertiseResponse {
  specializationIds: string[];
  practiceAreaIds: string[];
  languageIds: string[];
}

export interface ConsultationOfferResponse {
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

export interface EducationResponse {
  id: string;
  degree: string;
  institution: string;
  startYear: number;
  endYear: number | null;
  description: string | null;
  order: number;
}

export interface ExperienceResponse {
  id: string;
  position: string;
  organization: string;
  startYear: number;
  endYear: number | null;
  current: boolean;
  description: string | null;
  order: number;
}

export interface CertificationResponse {
  id: string;
  title: string;
  issuer: string;
  issueYear: number;
  expiryYear: number | null;
  credentialId: string | null;
  order: number;
}

export interface MembershipResponse {
  id: string;
  organization: string;
  role: string | null;
  startYear: number;
  endYear: number | null;
  order: number;
}

export interface VerificationResponse {
  status: VerificationStatus;
  verifiedAt: string | null;
  rejectionReason: string | null;
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

export interface ProfessionalProfileResponse {
  id: string;
  status: ProfessionalProfileStatus;
  publishedAt: string | null;
  unpublishedAt: string | null;
  identity: IdentityResponse;
  biography: BiographyResponse;
  contact: ContactResponse | null;
  office: OfficeResponse | null;
  expertise: ExpertiseResponse;
  offers: ConsultationOfferResponse[];
  education: EducationResponse[];
  experience: ExperienceResponse[];
  certifications: CertificationResponse[];
  memberships: MembershipResponse[];
  verification: VerificationResponse | null;
  completion: ProfileCompletion;
}

// ============================================================
// Partial response for PATCH /professional/profile
// ============================================================

export interface UpdateProfileResponse {
  id: string;
  status: ProfessionalProfileStatus;
  publishedAt: string | null;
  identity: IdentityResponse;
  biography: BiographyResponse;
}

// ============================================================
// Publication responses
// ============================================================

export interface PublishResponse {
  status: ProfessionalProfileStatus;
  publishedAt: string | null;
}

export interface UnpublishResponse {
  status: ProfessionalProfileStatus;
  unpublishedAt: string | null;
}

// ============================================================
// Toggle offer response
// ============================================================

export interface ToggleOfferResponse {
  id: string;
  active: boolean;
}
