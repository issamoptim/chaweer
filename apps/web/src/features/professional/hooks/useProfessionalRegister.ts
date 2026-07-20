import { useMutation } from "@tanstack/react-query";
import { authService, useAuth, getAuthErrorMessage } from "@/features/auth";
import type { ApiError } from "@/features/auth";
import type { ProfessionalRegisterFormData } from "../schemas/professional-register-schema";

interface UseProfessionalRegisterOptions {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function useProfessionalRegister(options?: UseProfessionalRegisterOptions) {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (data: ProfessionalRegisterFormData) => {
      const result = await authService.registerProfessional({
        email: data.email,
        password: data.password,
      });
      const me = await authService.getMe(result.accessToken);
      return { result, me };
    },
    onSuccess: ({ result, me }) => {
      login(result.accessToken, me);
      options?.onSuccess?.();
    },
    onError: (error: ApiError) => {
      options?.onError?.(getAuthErrorMessage(error.code));
    },
  });
}
