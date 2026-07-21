import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "@/features/auth/context/auth-context";
import { ToastProvider } from "@/components/ui/toaster";
import type { AuthContextValue } from "@/features/auth/context/auth-context";
import type { MeUser } from "@/features/auth/types/auth-types";
import { ProfessionalRegistrationPage } from "@/features/professional/pages/ProfessionalRegistrationPage";

const { mockNavigate } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
}));
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

const { mockRegisterProfessional, mockGetMe } = vi.hoisted(() => ({
  mockRegisterProfessional: vi.fn(),
  mockGetMe: vi.fn(),
}));
vi.mock("@/features/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/features/auth")>();
  return {
    ...actual,
    authService: {
      ...actual.authService,
      registerProfessional: mockRegisterProfessional,
      getMe: mockGetMe,
    },
    initiateGoogleLogin: vi.fn(),
  };
});

const mockProUser: MeUser = {
  id: "pro-1",
  email: "avocat@cabinet.com",
  firstName: "Avocat",
  lastName: "Test",
  role: "PROFESSIONAL",
  avatarUrl: null,
  authProvider: "LOCAL",
};

function createMockAuthValue(overrides?: Partial<AuthContextValue>): AuthContextValue {
  return {
    user: null,
    accessToken: null,
    status: "anonymous",
    apiUnavailable: false,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    refresh: vi.fn(),
    refetchUser: vi.fn(),
    restoreSession: vi.fn(),
    ...overrides,
  };
}

function renderWithProviders(
  ui: React.ReactNode,
  authValue?: Partial<AuthContextValue>,
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={createMockAuthValue(authValue)}>
        <ToastProvider>
          <MemoryRouter>{ui}</MemoryRouter>
        </ToastProvider>
      </AuthContext.Provider>
    </QueryClientProvider>,
  );
}

describe("ProfessionalRegistrationPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page title, pro badge, and form fields", () => {
    renderWithProviders(<ProfessionalRegistrationPage />);
    expect(screen.getByText("Créer votre compte professionnel")).toBeInTheDocument();
    expect(screen.getByText("Espace professionnel")).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail professionnel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Mot de passe$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmer le mot de passe/i)).toBeInTheDocument();
  });

  it("disables submit button when form is empty", () => {
    renderWithProviders(<ProfessionalRegistrationPage />);
    const button = screen.getByRole("button", { name: /Créer mon compte professionnel/i });
    expect(button).toBeDisabled();
  });

  it("enables submit button when form is valid", async () => {
    renderWithProviders(<ProfessionalRegistrationPage />);

    fireEvent.change(screen.getByLabelText(/E-mail professionnel/i), {
      target: { value: "avocat@cabinet.com" },
    });
    fireEvent.change(screen.getByLabelText(/^Mot de passe$/i), {
      target: { value: "Password1" },
    });
    fireEvent.change(screen.getByLabelText(/Confirmer le mot de passe/i), {
      target: { value: "Password1" },
    });

    await waitFor(() => {
      const button = screen.getByRole("button", { name: /Créer mon compte professionnel/i });
      expect(button).not.toBeDisabled();
    });
  });

  it("shows validation error for invalid email", async () => {
    renderWithProviders(<ProfessionalRegistrationPage />);

    fireEvent.change(screen.getByLabelText(/E-mail professionnel/i), {
      target: { value: "not-an-email" },
    });
    fireEvent.change(screen.getByLabelText(/^Mot de passe$/i), {
      target: { value: "Password1" },
    });
    fireEvent.change(screen.getByLabelText(/Confirmer le mot de passe/i), {
      target: { value: "Password1" },
    });
    fireEvent.blur(screen.getByLabelText(/E-mail professionnel/i));

    await waitFor(() => {
      expect(screen.getByText(/Adresse e-mail invalide/i)).toBeInTheDocument();
    });
  });

  it("shows validation error for mismatched passwords", async () => {
    renderWithProviders(<ProfessionalRegistrationPage />);

    fireEvent.change(screen.getByLabelText(/E-mail professionnel/i), {
      target: { value: "avocat@cabinet.com" },
    });
    fireEvent.change(screen.getByLabelText(/^Mot de passe$/i), {
      target: { value: "Password1" },
    });
    fireEvent.change(screen.getByLabelText(/Confirmer le mot de passe/i), {
      target: { value: "Different1" },
    });
    fireEvent.blur(screen.getByLabelText(/Confirmer le mot de passe/i));

    await waitFor(() => {
      expect(screen.getByText(/Les mots de passe ne correspondent pas/i)).toBeInTheDocument();
    });
  });

  it("submits form and navigates to onboarding on success", async () => {
    mockRegisterProfessional.mockResolvedValueOnce({ accessToken: "fake-token" });
    mockGetMe.mockResolvedValueOnce(mockProUser);

    renderWithProviders(<ProfessionalRegistrationPage />);

    fireEvent.change(screen.getByLabelText(/E-mail professionnel/i), {
      target: { value: "avocat@cabinet.com" },
    });
    fireEvent.change(screen.getByLabelText(/^Mot de passe$/i), {
      target: { value: "Password1" },
    });
    fireEvent.change(screen.getByLabelText(/Confirmer le mot de passe/i), {
      target: { value: "Password1" },
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Créer mon compte professionnel/i })).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole("button", { name: /Créer mon compte professionnel/i }));

    await waitFor(() => {
      expect(mockRegisterProfessional).toHaveBeenCalledWith({
        email: "avocat@cabinet.com",
        password: "Password1",
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/pro/profil", { replace: true });
    });
  });

  it("displays server error on registration failure", async () => {
    mockRegisterProfessional.mockRejectedValueOnce({
      code: "EMAIL_ALREADY_EXISTS",
      message: "Email already used",
    });

    renderWithProviders(<ProfessionalRegistrationPage />);

    fireEvent.change(screen.getByLabelText(/E-mail professionnel/i), {
      target: { value: "avocat@cabinet.com" },
    });
    fireEvent.change(screen.getByLabelText(/^Mot de passe$/i), {
      target: { value: "Password1" },
    });
    fireEvent.change(screen.getByLabelText(/Confirmer le mot de passe/i), {
      target: { value: "Password1" },
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Créer mon compte professionnel/i })).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole("button", { name: /Créer mon compte professionnel/i }));

    await waitFor(() => {
      expect(screen.getByText(/Un compte existe déjà avec cette adresse e-mail/i)).toBeInTheDocument();
    });
  });

  it("renders Google login button", () => {
    renderWithProviders(<ProfessionalRegistrationPage />);
    expect(screen.getByRole("button", { name: /Google/i })).toBeInTheDocument();
  });

  it("renders link back to public registration", () => {
    renderWithProviders(<ProfessionalRegistrationPage />);
    expect(screen.getByText(/Retour à l'espace grand public/i)).toBeInTheDocument();
  });
});
