import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth";
import { professionalKeys } from "../api/professional-keys";
import { professionalService } from "../services/professional-service";
import type { Referential } from "../types/professional-types";

export function useReferential() {
  const { accessToken, status } = useAuth();

  return useQuery<Referential>({
    queryKey: professionalKeys.referential,
    queryFn: () => professionalService.getReferential(accessToken!),
    enabled: status === "authenticated" && !!accessToken,
    staleTime: 5 * 60 * 1000,
  });
}
