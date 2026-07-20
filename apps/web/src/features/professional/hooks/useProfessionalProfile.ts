import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth";
import { professionalKeys } from "../api/professional-keys";
import { professionalService } from "../services/professional-service";
import type { ProfessionalProfileData } from "../types/professional-types";

export function useProfessionalProfile() {
  const { accessToken, status } = useAuth();

  return useQuery<ProfessionalProfileData>({
    queryKey: professionalKeys.me,
    queryFn: () => professionalService.getMe(accessToken!),
    enabled: status === "authenticated" && !!accessToken,
    staleTime: 30 * 1000,
  });
}
