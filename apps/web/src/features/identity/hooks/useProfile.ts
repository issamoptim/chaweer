import { useQuery } from "@tanstack/react-query";
import { identityKeys } from "../api/identity-keys";
import { identityService } from "../services/identity-service";
import { useAuth } from "@/features/auth";
import type { ProfileData } from "../types/identity-types";

export function useProfile() {
  const { accessToken, status } = useAuth();

  return useQuery<ProfileData>({
    queryKey: identityKeys.profile,
    queryFn: () => identityService.getProfile(accessToken!),
    enabled: status === "authenticated" && !!accessToken,
    staleTime: 60 * 1000,
  });
}
