import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth-service";
import { useAuth } from "./useAuth";
import { getAuthErrorMessage } from "../utils/auth-error-messages";
import { splitFullName, type RegisterFormData } from "../schemas/register-schema";
import type { ApiError, RegisterInput } from "../types/auth-types";

interface UseRegisterOptions {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function useRegister(options?: UseRegisterOptions) {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const { firstName, lastName } = splitFullName(data.fullName);

      const registerInput: RegisterInput = {
        email: data.email,
        password: data.password,
        firstName,
        lastName,
      };

      await authService.register(registerInput);

      const loginResult = await authService.login({
        email: data.email,
        password: data.password,
      });

      const me = await authService.getMe(loginResult.accessToken);

      return { loginResult, me };
    },
    onSuccess: ({ loginResult, me }) => {
      login(loginResult.accessToken, me);
      options?.onSuccess?.();
    },
    onError: (error: ApiError) => {
      const message = getAuthErrorMessage(error.code);
      options?.onError?.(message);
    },
  });
}
