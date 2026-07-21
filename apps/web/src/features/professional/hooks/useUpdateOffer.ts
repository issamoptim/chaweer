import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth";
import { professionalKeys } from "../api/professional-keys";
import { professionalService } from "../services/professional-service";
import type { ProfessionalProfileData, UpdateOfferInput } from "../types/professional-types";

export function useUpdateOffer() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateOfferInput) => professionalService.updateOffer(input, accessToken!),
    onSuccess: (data: ProfessionalProfileData) => {
      queryClient.setQueryData(professionalKeys.me, data);
    },
  });
}
