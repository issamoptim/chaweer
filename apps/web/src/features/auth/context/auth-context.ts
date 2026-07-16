import { createContext } from "react";
import type { AuthStatus, MeUser } from "@/features/auth/types/auth-types";

export interface AuthContextValue {
  user: MeUser | null;
  accessToken: string | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, user: MeUser) => void;
  logout: () => void;
  refresh: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
