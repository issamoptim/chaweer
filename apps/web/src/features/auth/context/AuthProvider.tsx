import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AuthContext, type AuthContextValue } from "./auth-context";
import { authService } from "../services/auth-service";
import { setTokenRefreshedCallback } from "@/services/api-client";
import type { AuthStatus, MeUser } from "../types/auth-types";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<MeUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [apiUnavailable, setApiUnavailable] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    setTokenRefreshedCallback((token: string) => {
      setAccessToken(token);
    });
  }, []);

  const restoreSession = useCallback(async () => {
    setStatus("loading");
    setApiUnavailable(false);

    try {
      const { accessToken } = await authService.refresh();
      setAccessToken(accessToken);

      const me = await authService.getMe(accessToken);
      setUser(me);
      setStatus("authenticated");
    } catch {
      setAccessToken(null);
      setUser(null);
      setStatus("anonymous");
      setApiUnavailable(true);
    }
  }, []);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  const login = useCallback((accessToken: string, meUser: MeUser) => {
    setAccessToken(accessToken);
    setUser(meUser);
    setStatus("authenticated");
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    setStatus("anonymous");
  }, []);

  const refresh = useCallback(async () => {
    try {
      const { accessToken } = await authService.refresh();
      setAccessToken(accessToken);
    } catch {
      setAccessToken(null);
      setUser(null);
      setStatus("anonymous");
    }
  }, []);

  const refetchUser = useCallback(async () => {
    if (!accessToken) return;

    try {
      const me = await authService.getMe(accessToken);
      setUser(me);
    } catch {
      // keep current state on refetch failure
    }
  }, [accessToken]);

  const value: AuthContextValue = {
    user,
    accessToken,
    status,
    apiUnavailable,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    login,
    logout,
    refresh,
    refetchUser,
    restoreSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
