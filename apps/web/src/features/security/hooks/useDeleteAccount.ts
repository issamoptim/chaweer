import { useMutation } from "@tanstack/react-query";
import { securityService } from "../services/security-service";
import type { ApiError } from "@/features/auth/types/auth-types";

interface UseDeleteAccountOptions {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function useDeleteAccount(options?: UseDeleteAccountOptions) {
  return useMutation({
    mutationFn: (token: string) => securityService.deleteAccount(token),
    onSuccess: () => {
      options?.onSuccess?.();
    },
    onError: (error: ApiError) => {
      const message =
        error.code === "UNAUTHORIZED"
          ? "Session expirée. Veuillez vous reconnecter."
          : "Une erreur est survenue. Veuillez réessayer.";
      options?.onError?.(message);
    },
  });
}
