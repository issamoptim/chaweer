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
  offer: ConsultationOfferData | null;
  completion: ProfileCompletion;
}

export interface ConsultationOfferData {
  price: number;
  currency: string;
  durationMinutes: number;
  modalities: string[];
}

export interface ProfileCompletion {
  profile: boolean;
  expertise: boolean;
  offer: boolean;
}
