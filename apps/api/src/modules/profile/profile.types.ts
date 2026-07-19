export interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  country: string | null;
  city: string | null;
  nationality: string | null;
  preferredLanguage: string | null;
  notificationEmail: boolean;
  notificationPush: boolean;
  role: string;
}

export interface PreferencesInput {
  preferredLanguage?: 'fr' | 'ar' | 'en';
  notificationEmail?: boolean;
  notificationPush?: boolean;
}

export interface UpdateProfileInput {
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  country?: string | null;
  city?: string | null;
  nationality?: string | null;
}
