import { apiClient } from "@/services/api-client";
import type { PublicProfileData } from "../types/public-types";
import type { PublicReferential, PublicListResponse } from "../types/lawyer";

export const publicService = {
  getProfessionalProfile(id: string): Promise<PublicProfileData> {
    return apiClient.get<PublicProfileData>(`/public/professional/${id}`);
  },

  getReferential(): Promise<PublicReferential> {
    return apiClient.get<PublicReferential>(`/public/referential`);
  },

  listProfessionals(params?: {
    specializations?: string[];
    city?: string;
    q?: string;
    page?: number;
    limit?: number;
  }): Promise<PublicListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.specializations && params.specializations.length > 0) {
      for (const spec of params.specializations) {
        searchParams.append("specialization", spec);
      }
    }
    if (params?.city) searchParams.set("city", params.city);
    if (params?.q) searchParams.set("q", params.q);
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString();
    return apiClient.get<PublicListResponse>(
      `/public/professionals${qs ? `?${qs}` : ""}`,
    );
  },
};
