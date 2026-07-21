import { apiClient } from "@/services/api-client";
import type {
  ProfileData,
  PreferencesInput,
  UpdateProfileInput,
} from "@/features/identity/types/identity-types";

export const identityService = {
  getProfile(token: string): Promise<ProfileData> {
    return apiClient.get<ProfileData>("/profile", { token });
  },

  updatePreferences(input: PreferencesInput, token: string): Promise<ProfileData> {
    return apiClient.patch<ProfileData>("/profile/preferences", input, { token });
  },

  updateProfile(input: UpdateProfileInput, token: string): Promise<ProfileData> {
    return apiClient.patch<ProfileData>("/profile", input, { token });
  },
};
