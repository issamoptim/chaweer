import { apiClient } from "@/services/api-client";
import type {
  ProfessionalProfileData,
  Referential,
  UpdateExpertiseInput,
  UpdateOfferInput,
  UpdateProfessionalProfileInput,
} from "../types/professional-types";

export const professionalService = {
  getReferential(token: string): Promise<Referential> {
    return apiClient.get<Referential>("/professional/referential", { token });
  },

  getMe(token: string): Promise<ProfessionalProfileData> {
    return apiClient.get<ProfessionalProfileData>("/professional/me", { token });
  },

  async uploadPhoto(file: File, token: string): Promise<string> {
    const result = await apiClient.uploadFile<{ photoUrl: string }>(
      "/professional/upload-photo",
      "photo",
      file,
      { token }
    );
    return result.photoUrl;
  },

  updateProfile(
    input: UpdateProfessionalProfileInput,
    token: string
  ): Promise<ProfessionalProfileData> {
    return apiClient.patch<ProfessionalProfileData>("/professional/profile", input, {
      token,
    });
  },

  updateExpertise(input: UpdateExpertiseInput, token: string): Promise<ProfessionalProfileData> {
    return apiClient.put<ProfessionalProfileData>("/professional/expertise", input, {
      token,
    });
  },

  updateOffer(input: UpdateOfferInput, token: string): Promise<ProfessionalProfileData> {
    return apiClient.put<ProfessionalProfileData>("/professional/offer", input, {
      token,
    });
  },
};
