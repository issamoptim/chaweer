import type { ApiError, AuthErrorCode } from "@/features/auth/types/auth-types";

const BASE_URL = import.meta.env.VITE_API_URL as string;

interface RequestOptions {
  token?: string;
}

async function request<T>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options?.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      credentials: "include",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    const error: ApiError = {
      code: "INTERNAL_ERROR",
      message: "Impossible de contacter le serveur.",
    };
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const json = await response.json().catch(() => null);

  if (!response.ok || !json) {
    const error: ApiError = json?.error
      ? {
          code: json.error.code as AuthErrorCode,
          message: json.error.message as string,
          details: json.error.details,
        }
      : {
          code: "INTERNAL_ERROR",
          message: "Une erreur inattendue est survenue.",
        };
    throw error;
  }

  return json.data as T;
}

export const apiClient = {
  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>("GET", path, undefined, options);
  },

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>("POST", path, body, options);
  },

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>("PATCH", path, body, options);
  },

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>("DELETE", path, undefined, options);
  },
};
