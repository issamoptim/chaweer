import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth";
import { professionalKeys } from "../api/professional-keys";
import { professionalService } from "../services/professional-service";
import type { UpdateExpertiseInput } from "../types/professional-types";

export function useUpdateExpertise() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateExpertiseInput) =>
      professionalService.updateExpertise(input, accessToken!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: professionalKeys.me });
      void queryClient.invalidateQueries({ queryKey: ["public-profile"] });
    },
  });
}
