import { useQuery } from "@tanstack/react-query";
import { authKeys } from "../api/auth-keys";
import { authService } from "../services/auth-service";
import { useAuth } from "./useAuth";
import type { MeUser } from "../types/auth-types";

export function useCurrentUser() {
  const { accessToken, status } = useAuth();

  return useQuery<MeUser>({
    queryKey: authKeys.me,
    queryFn: () => authService.getMe(accessToken!),
    enabled: status === "authenticated" && !!accessToken,
    staleTime: Infinity,
  });
}
