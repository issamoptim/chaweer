import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth";
import { publicService } from "../services/public-service";
import type { PublicProfileData } from "../types/public-types";

export function usePublicProfile(id: string | undefined) {
  const { accessToken } = useAuth();

  return useQuery<PublicProfileData>({
    queryKey: ["public-profile", id],
    queryFn: () => publicService.getProfessionalProfile(id!, accessToken ?? undefined),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}
