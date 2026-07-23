import type { ApiError, AuthErrorCode } from "@/features/auth/types/auth-types";

const BASE_URL = import.meta.env.VITE_API_URL as string;

interface RequestOptions {
  token?: string;
}

let onTokenRefreshed: ((token: string) => void) | null = null;

export function setTokenRefreshedCallback(cb: (token: string) => void): void {
  onTokenRefreshed = cb;
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) return null;
      const json = await res.json();
      const token = json?.data?.accessToken as string | undefined;
      if (token && onTokenRefreshed) onTokenRefreshed(token);
      return token ?? null;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function request<T>(
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
  path: string,
  body?: unknown,
  options?: RequestOptions
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

  if (response.status === 401 && !path.startsWith("/auth/")) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
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
    }
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
          missingRequirements: json.error.missingRequirements as string[] | undefined,
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

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>("PUT", path, body, options);
  },

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>("DELETE", path, undefined, options);
  },

  async uploadFile<T>(
    path: string,
    fieldName: string,
    file: File,
    options?: RequestOptions
  ): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);

    const headers: Record<string, string> = {};
    if (options?.token) {
      headers["Authorization"] = `Bearer ${options.token}`;
    }

    let response: Response;

    try {
      response = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers,
        credentials: "include",
        body: formData,
      });
    } catch {
      const error: ApiError = {
        code: "INTERNAL_ERROR",
        message: "Impossible de contacter le serveur.",
      };
      throw error;
    }

    if (response.status === 401 && !path.startsWith("/auth/")) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        headers["Authorization"] = `Bearer ${newToken}`;
        try {
          response = await fetch(`${BASE_URL}${path}`, {
            method: "POST",
            headers,
            credentials: "include",
            body: formData,
          });
        } catch {
          const error: ApiError = {
            code: "INTERNAL_ERROR",
            message: "Impossible de contacter le serveur.",
          };
          throw error;
        }
      }
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
            missingRequirements: json.error.missingRequirements as string[] | undefined,
          }
        : {
            code: "INTERNAL_ERROR",
            message: "Une erreur inattendue est survenue.",
          };
      throw error;
    }

    return json.data as T;
  },
};
