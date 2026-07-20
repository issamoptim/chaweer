import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth-service";
import { useAuth } from "./useAuth";
import { getAuthErrorMessage } from "../utils/auth-error-messages";
import type { ApiError, GoogleAuthInput } from "../types/auth-types";

interface UseGoogleLoginOptions {
  onSuccess?: () => void;
  onError?: (message: string, error?: ApiError) => void;
}

export function useGoogleLogin(options?: UseGoogleLoginOptions) {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (input: GoogleAuthInput & { professional?: boolean }) => {
      const { professional, ...authInput } = input;
      const result = professional
        ? await authService.googleAuthProfessional(authInput)
        : await authService.googleAuthClient(authInput);
      const me = await authService.getMe(result.accessToken);
      return { result, me };
    },
    onSuccess: ({ result, me }) => {
      login(result.accessToken, me);
      options?.onSuccess?.();
    },
    onError: (error: ApiError) => {
      const message = getAuthErrorMessage(error.code);
      options?.onError?.(message, error);
    },
  });
}
