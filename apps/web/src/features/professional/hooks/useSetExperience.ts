import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth";
import { professionalKeys } from "../api/professional-keys";
import { professionalService } from "../services/professional-service";
import type { ExperienceInput } from "../types/professional-types";

export function useSetExperience() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: ExperienceInput[]) =>
      professionalService.setExperience(items, accessToken!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: professionalKeys.me });
      void queryClient.invalidateQueries({ queryKey: ["public-profile"] });
    },
  });
}
