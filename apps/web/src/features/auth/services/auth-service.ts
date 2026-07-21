import { apiClient } from "@/services/api-client";
import type {
  GoogleAuthInput,
  LoginInput,
  LoginResult,
  MeUser,
  RefreshResult,
  RegisterInput,
  RegisterProfessionalInput,
  RegisterResult,
} from "@/features/auth/types/auth-types";

export const authService = {
  register(input: RegisterInput): Promise<RegisterResult> {
    return apiClient.post<RegisterResult>("/auth/register", input);
  },

  registerProfessional(input: RegisterProfessionalInput): Promise<LoginResult> {
    return apiClient.post<LoginResult>("/auth/register/professional", input);
  },

  googleAuthProfessional(input: GoogleAuthInput): Promise<LoginResult> {
    return apiClient.post<LoginResult>("/auth/google/professional", input);
  },

  login(input: LoginInput): Promise<LoginResult> {
    return apiClient.post<LoginResult>("/auth/login", input);
  },

  refresh(): Promise<RefreshResult> {
    return apiClient.post<RefreshResult>("/auth/refresh");
  },

  logout(): Promise<void> {
    return apiClient.post<void>("/auth/logout");
  },

  getMe(token: string): Promise<MeUser> {
    return apiClient.get<MeUser>("/auth/me", { token });
  },

  googleAuthClient(input: GoogleAuthInput): Promise<LoginResult> {
    return apiClient.post<LoginResult>("/auth/google/client", input);
  },
  changePassword(
    input: { currentPassword: string; newPassword: string; confirmPassword: string },
    token: string
  ): Promise<{ message: string }> {
    return apiClient.patch<{ message: string }>("/auth/password", input, { token });
  },

  deleteAccount(token: string): Promise<void> {
    return apiClient.delete<void>("/auth/account", { token });
  },
};
