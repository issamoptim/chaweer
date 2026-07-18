import { apiClient } from "@/services/api-client";
import type { ProfileData, PreferencesInput } from "@/features/identity/types/identity-types";

export const identityService = {
  getProfile(token: string): Promise<ProfileData> {
    return apiClient.get<ProfileData>("/profile", { token });
  },

  updatePreferences(input: PreferencesInput, token: string): Promise<ProfileData> {
    return apiClient.patch<ProfileData>("/profile/preferences", input, { token });
  },
};
