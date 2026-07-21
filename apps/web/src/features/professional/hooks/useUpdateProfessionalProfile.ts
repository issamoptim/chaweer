import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth";
import { professionalKeys } from "../api/professional-keys";
import { professionalService } from "../services/professional-service";
import type {
  UpdateProfessionalProfileInput,
} from "../types/professional-types";

export function useUpdateProfessionalProfile() {
  const { accessToken, refetchUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfessionalProfileInput) =>
      professionalService.updateProfile(input, accessToken!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: professionalKeys.me });
      void refetchUser();
    },
  });
}
