import { apiClient } from "@/services/api-client";
import type { PublishResponse } from "@chaweer/shared";
import type {
  ProfessionalProfileData,
  UpdateProfileResponseData,
  ExpertiseData,
  Referential,
  UpdateExpertiseInput,
  UpdateOfferInput,
  UpdateProfessionalProfileInput,
  UpdateContactInput,
  UpdateOfficeInput,
  ContactData,
  OfficeData,
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
  ): Promise<UpdateProfileResponseData> {
    return apiClient.patch<UpdateProfileResponseData>("/professional/profile", input, {
      token,
    });
  },

  updateExpertise(input: UpdateExpertiseInput, token: string): Promise<ExpertiseData> {
    return apiClient.put<ExpertiseData>("/professional/expertise", input, {
      token,
    });
  },

  updateOffer(input: UpdateOfferInput, token: string): Promise<ProfessionalProfileData> {
    return apiClient.put<ProfessionalProfileData>("/professional/offer", input, {
      token,
    });
  },

  deleteOffer(token: string): Promise<ProfessionalProfileData> {
    return apiClient.delete<ProfessionalProfileData>("/professional/offer", { token });
  },

  publish(token: string): Promise<PublishResponse> {
    return apiClient.post<PublishResponse>("/professional/profile/publish", undefined, {
      token,
    });
  },

  unpublish(token: string): Promise<PublishResponse> {
    return apiClient.post<PublishResponse>("/professional/profile/unpublish", undefined, {
      token,
    });
  },

  updateContact(input: UpdateContactInput, token: string): Promise<ContactData> {
    return apiClient.patch<ContactData>("/professional/contact", input, { token });
  },

  updateOffice(input: UpdateOfficeInput, token: string): Promise<OfficeData> {
    return apiClient.patch<OfficeData>("/professional/office", input, { token });
  },
};
