import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleCallback } from "@/app/pages/GoogleCallback";
import { saveOAuthState } from "@/features/auth/utils/oauth-storage";

const mockLogin = vi.fn();

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: () => ({
    login: mockLogin,
    user: null,
    accessToken: null,
    status: "anonymous",
    apiUnavailable: false,
    isAuthenticated: false,
    isLoading: false,
    logout: vi.fn(),
    refresh: vi.fn(),
    refetchUser: vi.fn(),
    restoreSession: vi.fn(),
  }),
}));

vi.mock("@/features/auth/services/auth-service", () => ({
  authService: {
    googleAuthClient: vi.fn(),
    getMe: vi.fn(),
  },
}));

function renderCallback(initialPath: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          <Route path="/connexion" element={<div data-testid="connexion">Connexion</div>} />
          <Route path="/" element={<div data-testid="home">Home</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("GoogleCallback", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it("shows error and redirects when code is missing", async () => {
    renderCallback("/auth/google/callback?state=abc123");

    await waitFor(() => {
      expect(screen.getByText(/L'authentification Google a échoué/i)).toBeInTheDocument();
    });
  });

  it("shows error when OAuth error param is present (access_denied)", async () => {
    saveOAuthState({ codeVerifier: "verifier", state: "abc123", from: "/" });

    renderCallback("/auth/google/callback?error=access_denied");

    await waitFor(() => {
      expect(screen.getByText(/Vous avez refusé la connexion avec Google/i)).toBeInTheDocument();
    });

    expect(sessionStorage.getItem("google_pkce")).toBeNull();
  });

  it("shows error when state does not match", async () => {
    saveOAuthState({ codeVerifier: "verifier", state: "correct-state", from: "/" });

    renderCallback("/auth/google/callback?code=test-code&state=wrong-state");

    await waitFor(() => {
      expect(screen.getByText(/Session invalide/i)).toBeInTheDocument();
    });

    expect(sessionStorage.getItem("google_pkce")).toBeNull();
  });

  it("shows error when no sessionStorage entry exists", async () => {
    renderCallback("/auth/google/callback?code=test-code&state=abc123");

    await waitFor(() => {
      expect(screen.getByText(/Session invalide/i)).toBeInTheDocument();
    });
  });

  it("clears sessionStorage on OAuth error", async () => {
    saveOAuthState({ codeVerifier: "verifier", state: "abc123", from: "/" });

    renderCallback("/auth/google/callback?error=access_denied");

    await waitFor(() => {
      expect(sessionStorage.getItem("google_pkce")).toBeNull();
    });
  });

  it("clears sessionStorage on missing code", async () => {
    saveOAuthState({ codeVerifier: "verifier", state: "abc123", from: "/" });

    renderCallback("/auth/google/callback?state=abc123");

    await waitFor(() => {
      expect(sessionStorage.getItem("google_pkce")).toBeNull();
    });
  });

  it("clears sessionStorage on state mismatch", async () => {
    saveOAuthState({ codeVerifier: "verifier", state: "correct", from: "/" });

    renderCallback("/auth/google/callback?code=test&state=wrong");

    await waitFor(() => {
      expect(sessionStorage.getItem("google_pkce")).toBeNull();
    });
  });

  it("shows loading spinner while processing valid callback", async () => {
    saveOAuthState({ codeVerifier: "verifier", state: "abc123", from: "/" });

    const { authService } = await import("@/features/auth/services/auth-service");
    vi.mocked(authService.googleAuthClient).mockImplementation(
      () => new Promise(() => {}) as never
    );

    renderCallback("/auth/google/callback?code=test-code&state=abc123");

    expect(screen.getByText(/Connexion à Google en cours/i)).toBeInTheDocument();
  });
});
