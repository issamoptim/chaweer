import { QueryClient } from "@tanstack/react-query";
import type { ApiError } from "@/features/auth/types/auth-types";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: (failureCount, error) => {
        if (
          error &&
          typeof error === "object" &&
          "code" in error &&
          (error as ApiError).code === "UNAUTHORIZED"
        ) {
          return false;
        }
        return failureCount < 1;
      },
    },
  },
});
