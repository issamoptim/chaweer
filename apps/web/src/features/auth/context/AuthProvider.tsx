import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AuthContext, type AuthContextValue } from "./auth-context";
import { authService } from "../services/auth-service";
import type { ApiError, AuthStatus, MeUser } from "../types/auth-types";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<MeUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const tokenRef = useRef<string | null>(null);

  const restoreSession = useCallback(async () => {
    setStatus("loading");

    try {
      const { accessToken } = await authService.refresh();
      tokenRef.current = accessToken;

      const me = await authService.getMe(accessToken);
      setUser(me);
      setStatus("authenticated");
    } catch (error) {
      const apiError = error as ApiError;

      if (
        apiError.code === "INVALID_REFRESH_TOKEN" ||
        apiError.code === "TOKEN_EXPIRED" ||
        apiError.code === "UNAUTHORIZED"
      ) {
        tokenRef.current = null;
        setUser(null);
        setStatus("anonymous");
      } else {
        tokenRef.current = null;
        setUser(null);
        setStatus("error");
      }
    }
  }, []);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  const login = useCallback((accessToken: string, meUser: MeUser) => {
    tokenRef.current = accessToken;
    setUser(meUser);
    setStatus("authenticated");
  }, []);

  const logout = useCallback(() => {
    tokenRef.current = null;
    setUser(null);
    setStatus("anonymous");
  }, []);

  const refresh = useCallback(async () => {
    try {
      const { accessToken } = await authService.refresh();
      tokenRef.current = accessToken;
    } catch {
      tokenRef.current = null;
      setUser(null);
      setStatus("anonymous");
    }
  }, []);

  const refetchUser = useCallback(async () => {
    if (!tokenRef.current) return;

    try {
      const me = await authService.getMe(tokenRef.current);
      setUser(me);
    } catch {
      // keep current state on refetch failure
    }
  }, []);

  const value: AuthContextValue = {
    user,
    accessToken: tokenRef.current,
    status,
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
