import { useQuery } from "@tanstack/react-query";
import { publicService } from "../services/public-service";
import type { PublicProfileData } from "../types/public-types";

export function usePublicProfile(id: string | undefined) {
  return useQuery<PublicProfileData>({
    queryKey: ["public-profile", id],
    queryFn: () => publicService.getProfessionalProfile(id!),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}
