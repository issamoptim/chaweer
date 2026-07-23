import { apiClient } from "@/services/api-client";
import type { PublicProfileData } from "../types/public-types";

export const publicService = {
  getProfessionalProfile(id: string): Promise<PublicProfileData> {
    return apiClient.get<PublicProfileData>(`/public/professional/${id}`);
  },
};
