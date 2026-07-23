export interface PublicIdentityData {
  firstName: string;
  lastName: string;
  professionalTitle: string | null;
  registrationNumber: string | null;
  yearsOfExperience: number | null;
  photoUrl: string | null;
  barAssociationId: string | null;
}

export interface PublicBiographyData {
  bio: string | null;
}

export interface PublicContactData {
  phone: string | null;
  whatsapp: string | null;
  publicEmail: string | null;
  website: string | null;
  linkedInUrl: string | null;
}

export interface PublicOfficeData {
  name: string | null;
  address: string | null;
  cityId: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface PublicExpertiseData {
  specializationIds: string[];
  practiceAreaIds: string[];
  languageIds: string[];
}

export interface PublicOfferData {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  durationMinutes: number;
  modalities: string[];
  active: boolean;
  order: number;
}

export interface PublicEducationData {
  id: string;
  degree: string | null;
  institution: string | null;
  startYear: number | null;
  endYear: number | null;
  description: string | null;
  order: number;
}

export interface PublicExperienceData {
  id: string;
  position: string | null;
  organization: string | null;
  startYear: number | null;
  endYear: number | null;
  current: boolean;
  description: string | null;
  order: number;
}

export interface PublicCertificationData {
  id: string;
  title: string | null;
  issuer: string | null;
  issueYear: number | null;
  expiryYear: number | null;
  credentialId: string | null;
  order: number;
}

export interface PublicMembershipData {
  id: string;
  organization: string | null;
  role: string | null;
  startYear: number | null;
  endYear: number | null;
  order: number;
}

export interface PublicProfileData {
  id: string;
  identity: PublicIdentityData;
  biography: PublicBiographyData;
  contact: PublicContactData | null;
  office: PublicOfficeData | null;
  expertise: PublicExpertiseData;
  specializationNames: string[];
  practiceAreaNames: string[];
  languageNames: string[];
  offers: PublicOfferData[];
  education: PublicEducationData[];
  experience: PublicExperienceData[];
  certifications: PublicCertificationData[];
  memberships: PublicMembershipData[];
  barAssociationName: string | null;
  cityName: string | null;
}
