import { useAuth } from "./useAuth";

export function useSessionRestore() {
  const { restoreSession } = useAuth();

  return { restoreSession };
}
