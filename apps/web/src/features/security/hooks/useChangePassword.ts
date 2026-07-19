import { useMutation } from "@tanstack/react-query";
import { securityService } from "../services/security-service";
import type { ApiError } from "@/features/auth/types/auth-types";
import type { ChangePasswordFormData } from "../schemas/change-password-schema";

interface UseChangePasswordOptions {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function useChangePassword(options?: UseChangePasswordOptions) {
  return useMutation({
    mutationFn: (input: { data: ChangePasswordFormData; token: string }) =>
      securityService.changePassword(
        {
          currentPassword: input.data.currentPassword,
          newPassword: input.data.newPassword,
          confirmPassword: input.data.confirmPassword,
        },
        input.token,
      ),
    onSuccess: () => {
      options?.onSuccess?.();
    },
    onError: (error: ApiError) => {
      const message =
        error.code === "INVALID_CREDENTIALS"
          ? "Le mot de passe actuel est incorrect."
          : error.message || "Une erreur est survenue. Veuillez réessayer.";
      options?.onError?.(message);
    },
  });
}
