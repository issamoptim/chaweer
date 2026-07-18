import { useMutation, useQueryClient } from "@tanstack/react-query";
import { identityKeys } from "../api/identity-keys";
import { identityService } from "../services/identity-service";
import { useAuth } from "@/features/auth";
import type { PreferencesInput } from "../types/identity-types";

export function useUpdatePreferences() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: PreferencesInput) =>
      identityService.updatePreferences(input, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: identityKeys.profile });
    },
  });
}
