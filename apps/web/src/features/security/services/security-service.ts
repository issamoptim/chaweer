import { authService } from "@/features/auth/services/auth-service";
import type { ChangePasswordInput } from "../types/security-types";

export const securityService = {
  changePassword(input: ChangePasswordInput, token: string) {
    return authService.changePassword(input, token);
  },

  deleteAccount(token: string) {
    return authService.deleteAccount(token);
  },
};
