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

export interface ConsultationOfferData {
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
  firstName: string;
  lastName: string;
  email: string;
  photoUrl: string | null;
  barAssociationId: string | null;
  cityId: string | null;
  professionalPhone: string | null;
  officeAddress: string | null;
  bio: string | null;
  specializationIds: string[];
  practiceAreaIds: string[];
  languageIds: string[];
  offers: ConsultationOfferData[];
  completion: ProfileCompletion;
}
