import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "@/features/auth/context/auth-context";
import { ToastProvider } from "@/components/ui/toaster";
import type { AuthContextValue } from "@/features/auth/context/auth-context";
import type { MeUser } from "@/features/auth/types/auth-types";
import { SecurityPage } from "@/features/security/pages/SecurityPage";
import * as authService from "@/features/auth/services/auth-service";

const { mockNavigate } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
}));
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

const localUser: MeUser = {
  id: "user-1",
  email: "john@example.com",
  firstName: "John",
  lastName: "Doe",
  role: "CLIENT",
  avatarUrl: null,
  authProvider: "LOCAL",
};

const googleUser: MeUser = {
  id: "user-2",
  email: "google@gmail.com",
  firstName: "Google",
  lastName: "User",
  role: "CLIENT",
  avatarUrl: null,
  authProvider: "GOOGLE",
};

function createMockAuthValue(
  user: MeUser,
  overrides?: Partial<AuthContextValue>
): AuthContextValue {
  return {
    user,
    accessToken: "fake-token",
    status: "authenticated",
    apiUnavailable: false,
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    refresh: vi.fn(),
    refetchUser: vi.fn(),
    restoreSession: vi.fn(),
    ...overrides,
  };
}

function renderWithProviders(ui: React.ReactNode, authValue: AuthContextValue) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={authValue}>
        <ToastProvider>{ui}</ToastProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

describe("SecurityPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockNavigate.mockClear();
  });

  describe("Email+Password variant", () => {
    it("renders page title, account card, password form, and danger zone", () => {
      renderWithProviders(<SecurityPage />, createMockAuthValue(localUser));

      expect(screen.getByText("Sécurité")).toBeInTheDocument();
      expect(
        screen.getByText("Gérez les accès et la protection de votre compte.")
      ).toBeInTheDocument();
      expect(screen.getByText("Compte")).toBeInTheDocument();
      expect(screen.getByText("Adresse e-mail")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
      expect(screen.getByText("Méthode de connexion")).toBeInTheDocument();
      expect(screen.getByText("E-mail et mot de passe")).toBeInTheDocument();
      expect(screen.getByText("Mot de passe")).toBeInTheDocument();
      expect(screen.getByText("Mot de passe actuel")).toBeInTheDocument();
      expect(screen.getByText("Nouveau mot de passe")).toBeInTheDocument();
      expect(screen.getByText("Confirmer le nouveau mot de passe")).toBeInTheDocument();
      expect(screen.getByText("Modifier le mot de passe")).toBeInTheDocument();
      expect(screen.getByText("Supprimer le compte")).toBeInTheDocument();
      expect(screen.getByText("Supprimer mon compte")).toBeInTheDocument();
    });

    it("shows password policy help text", () => {
      renderWithProviders(<SecurityPage />, createMockAuthValue(localUser));

      expect(
        screen.getByText("8 caractères minimum, avec au moins une lettre et un chiffre.")
      ).toBeInTheDocument();
    });

    it("shows validation error when current password is empty", async () => {
      renderWithProviders(<SecurityPage />, createMockAuthValue(localUser));

      fireEvent.click(screen.getByText("Modifier le mot de passe"));

      await waitFor(() => {
        expect(screen.getByText("Le mot de passe actuel est obligatoire.")).toBeInTheDocument();
      });
    });

    it("shows validation error when new password is too short", async () => {
      renderWithProviders(<SecurityPage />, createMockAuthValue(localUser));

      const currentPasswordInput = screen.getByLabelText("Mot de passe actuel");
      const newPasswordInput = screen.getByLabelText("Nouveau mot de passe");
      const confirmPasswordInput = screen.getByLabelText("Confirmer le nouveau mot de passe");

      fireEvent.change(currentPasswordInput, { target: { value: "OldPass123!" } });
      fireEvent.change(newPasswordInput, { target: { value: "short" } });
      fireEvent.change(confirmPasswordInput, { target: { value: "short" } });

      fireEvent.click(screen.getByText("Modifier le mot de passe"));

      await waitFor(() => {
        expect(
          screen.getByText("Le mot de passe doit contenir au moins 8 caractères.")
        ).toBeInTheDocument();
      });
    });

    it("shows validation error when passwords do not match", async () => {
      renderWithProviders(<SecurityPage />, createMockAuthValue(localUser));

      const currentPasswordInput = screen.getByLabelText("Mot de passe actuel");
      const newPasswordInput = screen.getByLabelText("Nouveau mot de passe");
      const confirmPasswordInput = screen.getByLabelText("Confirmer le nouveau mot de passe");

      fireEvent.change(currentPasswordInput, { target: { value: "OldPass123!" } });
      fireEvent.change(newPasswordInput, { target: { value: "NewPass456!" } });
      fireEvent.change(confirmPasswordInput, { target: { value: "DifferentPass789!" } });

      fireEvent.click(screen.getByText("Modifier le mot de passe"));

      await waitFor(() => {
        expect(screen.getByText("Les mots de passe ne correspondent pas.")).toBeInTheDocument();
      });
    });

    it("shows success toast on successful password change", async () => {
      vi.spyOn(authService, "authService", "get").mockReturnValue({
        ...authService.authService,
        changePassword: vi.fn().mockResolvedValue({ message: "ok" }),
      });

      renderWithProviders(<SecurityPage />, createMockAuthValue(localUser));

      const currentPasswordInput = screen.getByLabelText("Mot de passe actuel");
      const newPasswordInput = screen.getByLabelText("Nouveau mot de passe");
      const confirmPasswordInput = screen.getByLabelText("Confirmer le nouveau mot de passe");

      fireEvent.change(currentPasswordInput, { target: { value: "OldPass123!" } });
      fireEvent.change(newPasswordInput, { target: { value: "NewPass456!" } });
      fireEvent.change(confirmPasswordInput, { target: { value: "NewPass456!" } });

      fireEvent.click(screen.getByText("Modifier le mot de passe"));

      await waitFor(() => {
        expect(screen.getByText("Votre mot de passe a été modifié.")).toBeInTheDocument();
      });
    });

    it("shows error toast when current password is incorrect", async () => {
      const apiError = {
        code: "INVALID_CREDENTIALS",
        message: "Le mot de passe actuel est incorrect.",
        details: undefined,
      };
      vi.spyOn(authService, "authService", "get").mockReturnValue({
        ...authService.authService,
        changePassword: vi.fn().mockRejectedValue(apiError),
      });

      renderWithProviders(<SecurityPage />, createMockAuthValue(localUser));

      const currentPasswordInput = screen.getByLabelText("Mot de passe actuel");
      const newPasswordInput = screen.getByLabelText("Nouveau mot de passe");
      const confirmPasswordInput = screen.getByLabelText("Confirmer le nouveau mot de passe");

      fireEvent.change(currentPasswordInput, { target: { value: "WrongPass123!" } });
      fireEvent.change(newPasswordInput, { target: { value: "NewPass456!" } });
      fireEvent.change(confirmPasswordInput, { target: { value: "NewPass456!" } });

      fireEvent.click(screen.getByText("Modifier le mot de passe"));

      await waitFor(() => {
        expect(screen.getByText("Le mot de passe actuel est incorrect.")).toBeInTheDocument();
      });
    });
  });

  describe("Google variant", () => {
    it("renders account card with Google badge and Google notice", () => {
      renderWithProviders(<SecurityPage />, createMockAuthValue(googleUser));

      expect(screen.getByText("Compte")).toBeInTheDocument();
      expect(screen.getByText("google@gmail.com")).toBeInTheDocument();
      expect(screen.getByText("Google")).toBeInTheDocument();
      expect(screen.getByText("Votre mot de passe est géré par Google")).toBeInTheDocument();
      expect(screen.getByText(/myaccount.google.com/)).toBeInTheDocument();
    });

    it("does not render password form for Google users", () => {
      renderWithProviders(<SecurityPage />, createMockAuthValue(googleUser));

      expect(screen.queryByText("Mot de passe actuel")).not.toBeInTheDocument();
      expect(screen.queryByText("Modifier le mot de passe")).not.toBeInTheDocument();
    });

    it("renders danger zone for Google users", () => {
      renderWithProviders(<SecurityPage />, createMockAuthValue(googleUser));

      expect(screen.getByText("Supprimer le compte")).toBeInTheDocument();
      expect(screen.getByText("Supprimer mon compte")).toBeInTheDocument();
    });
  });

  describe("Delete account dialog", () => {
    it("opens confirmation dialog when delete button is clicked", async () => {
      renderWithProviders(<SecurityPage />, createMockAuthValue(localUser));

      fireEvent.click(screen.getByText("Supprimer mon compte"));

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(screen.getByText("Supprimer votre compte ?")).toBeInTheDocument();
      });
    });

    it("closes dialog when Annuler is clicked", async () => {
      renderWithProviders(<SecurityPage />, createMockAuthValue(localUser));

      fireEvent.click(screen.getByText("Supprimer mon compte"));

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Annuler"));

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("calls logout and navigates to /connexion on successful deletion", async () => {
      const mockLogout = vi.fn();
      vi.spyOn(authService, "authService", "get").mockReturnValue({
        ...authService.authService,
        deleteAccount: vi.fn().mockResolvedValue(undefined),
      });

      renderWithProviders(<SecurityPage />, createMockAuthValue(localUser, { logout: mockLogout }));

      fireEvent.click(screen.getByText("Supprimer mon compte"));

      await waitFor(() => {
        expect(screen.getByText("Supprimer définitivement")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Supprimer définitivement"));

      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/connexion");
      });
    });
  });

  describe("Loading state", () => {
    it("renders skeleton when user is null", () => {
      renderWithProviders(
        <SecurityPage />,
        createMockAuthValue(localUser, {
          user: null,
          accessToken: null,
          status: "loading",
        })
      );

      expect(screen.getByLabelText("Chargement de la sécurité")).toBeInTheDocument();
    });
  });
});
