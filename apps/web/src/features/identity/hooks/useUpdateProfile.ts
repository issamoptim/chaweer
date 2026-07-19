import { useMutation, useQueryClient } from "@tanstack/react-query";
import { identityKeys } from "../api/identity-keys";
import { identityService } from "../services/identity-service";
import { useAuth } from "@/features/auth";
import type { UpdateProfileInput } from "../types/identity-types";

export function useUpdateProfile() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) =>
      identityService.updateProfile(input, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: identityKeys.profile });
    },
  });
}
