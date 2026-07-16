import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth-service";
import { useAuth } from "./useAuth";
import { getAuthErrorMessage } from "../utils/auth-error-messages";
import type { ApiError, LoginInput } from "../types/auth-types";

interface UseLoginOptions {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function useLogin(options?: UseLoginOptions) {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const result = await authService.login(input);
      const me = await authService.getMe(result.accessToken);
      return { result, me };
    },
    onSuccess: ({ result, me }) => {
      login(result.accessToken, me);
      options?.onSuccess?.();
    },
    onError: (error: ApiError) => {
      const message = getAuthErrorMessage(error.code);
      options?.onError?.(message);
    },
  });
}
