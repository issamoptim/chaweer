import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth";
import { professionalKeys } from "../api/professional-keys";
import { professionalService } from "../services/professional-service";
import type {
  ProfessionalProfileData,
  UpdateProfessionalProfileInput,
} from "../types/professional-types";

export function useUpdateProfessionalProfile() {
  const { accessToken, refetchUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfessionalProfileInput) =>
      professionalService.updateProfile(input, accessToken!),
    onSuccess: (data: ProfessionalProfileData) => {
      queryClient.setQueryData(professionalKeys.me, data);
      void refetchUser();
    },
  });
}
