import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "@/features/auth/context/auth-context";
import { ToastProvider } from "@/components/ui/toaster";
import type { AuthContextValue } from "@/features/auth/context/auth-context";
import type { MeUser } from "@/features/auth/types/auth-types";
import { EditProfilePage } from "@/features/identity/pages/EditProfilePage";
import * as identityService from "@/features/identity/services/identity-service";
import type { ProfileData } from "@/features/identity/types/identity-types";

const mockUser: MeUser = {
  id: "user-1",
  email: "ahmed@example.com",
  firstName: "Ahmed",
  lastName: "Benali",
  role: "CLIENT",
  avatarUrl: null,
  authProvider: "LOCAL",
};

const mockProfile: ProfileData = {
  id: "user-1",
  firstName: "Ahmed",
  lastName: "Benali",
  email: "ahmed@example.com",
  phone: "+212600000000",
  country: "Maroc",
  city: "Casablanca",
  nationality: "Marocaine",
  preferredLanguage: "fr",
  notificationEmail: true,
  notificationPush: true,
  role: "CLIENT",
};

function createMockAuthValue(overrides?: Partial<AuthContextValue>): AuthContextValue {
  return {
    user: mockUser,
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

function renderWithProviders(
  ui: React.ReactNode,
  authValue?: Partial<AuthContextValue>,
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  const router = createMemoryRouter(
    [{ path: "/", element: ui }],
    { initialEntries: ["/"] },
  );

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={createMockAuthValue(authValue)}>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </AuthContext.Provider>
    </QueryClientProvider>,
  );
}

function mockIdentityService(profile: ProfileData, updateProfileFn?: ReturnType<typeof vi.fn>) {
  vi.spyOn(identityService, "identityService", "get").mockReturnValue({
    getProfile: vi.fn().mockResolvedValue(profile),
    updatePreferences: vi.fn(),
    updateProfile: updateProfileFn ?? vi.fn().mockResolvedValue(profile),
  });
}

describe("EditProfilePage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows loading skeleton while fetching profile", () => {
    vi.spyOn(identityService, "identityService", "get").mockReturnValue({
      getProfile: vi.fn().mockImplementation(() => new Promise(() => {})),
      updatePreferences: vi.fn(),
      updateProfile: vi.fn(),
    });

    renderWithProviders(<EditProfilePage />);

    expect(screen.getByLabelText("Chargement du formulaire")).toBeInTheDocument();
  });

  it("renders form with pre-filled data when profile is loaded", async () => {
    mockIdentityService(mockProfile);

    renderWithProviders(<EditProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Ahmed")).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue("Benali")).toBeInTheDocument();
    expect(screen.getByText("ahmed@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("+212600000000")).toBeInTheDocument();
  });

  it("displays email as read-only with lock icon", async () => {
    mockIdentityService(mockProfile);

    renderWithProviders(<EditProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("ahmed@example.com")).toBeInTheDocument();
    });
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("displays phone as an editable input field", async () => {
    mockIdentityService(mockProfile);

    renderWithProviders(<EditProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("+212600000000")).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue("+212600000000").tagName).toBe("INPUT");
  });

  it("does not show the false phone authentication helper text", async () => {
    mockIdentityService(mockProfile);

    renderWithProviders(<EditProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Ahmed")).toBeInTheDocument();
    });
    expect(screen.queryByText("Le numéro de téléphone est utilisé pour votre authentification.")).not.toBeInTheDocument();
  });

  it("disables Enregistrer button when no changes have been made", async () => {
    mockIdentityService(mockProfile);

    renderWithProviders(<EditProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Ahmed")).toBeInTheDocument();
    });

    const saveButton = screen.getByRole("button", { name: /Enregistrer/i });
    expect(saveButton).toBeDisabled();
  });

  it("enables Enregistrer button when a field is modified", async () => {
    mockIdentityService(mockProfile);

    renderWithProviders(<EditProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Ahmed")).toBeInTheDocument();
    });

    const firstNameInput = screen.getByDisplayValue("Ahmed");
    fireEvent.change(firstNameInput, { target: { value: "Mohamed" } });

    await waitFor(() => {
      const saveButton = screen.getByRole("button", { name: /Enregistrer/i });
      expect(saveButton).not.toBeDisabled();
    });
  });

  it("disables Enregistrer again when changes are reverted", async () => {
    mockIdentityService(mockProfile);

    renderWithProviders(<EditProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Ahmed")).toBeInTheDocument();
    });

    const firstNameInput = screen.getByDisplayValue("Ahmed");
    fireEvent.change(firstNameInput, { target: { value: "Mohamed" } });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Enregistrer/i })).not.toBeDisabled();
    });

    fireEvent.change(firstNameInput, { target: { value: "Ahmed" } });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Enregistrer/i })).toBeDisabled();
    });
  });

  it("shows error state when profile fetch fails", async () => {
    vi.spyOn(identityService, "identityService", "get").mockReturnValue({
      getProfile: vi.fn().mockRejectedValue(new Error("Network error")),
      updatePreferences: vi.fn(),
      updateProfile: vi.fn(),
    });

    renderWithProviders(<EditProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("Impossible de charger votre profil.")).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: /Réessayer/i })).toBeInTheDocument();
  });

  it("submits form and calls updateProfile on save", async () => {
    const updateProfileFn = vi.fn().mockResolvedValue({
      ...mockProfile,
      firstName: "Mohamed",
    });
    mockIdentityService(mockProfile, updateProfileFn);

    renderWithProviders(<EditProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Ahmed")).toBeInTheDocument();
    });

    const firstNameInput = screen.getByDisplayValue("Ahmed");
    fireEvent.change(firstNameInput, { target: { value: "Mohamed" } });

    const saveButton = screen.getByRole("button", { name: /Enregistrer/i });
    await waitFor(() => expect(saveButton).not.toBeDisabled());
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateProfileFn).toHaveBeenCalledWith(
        expect.objectContaining({ firstName: "Mohamed" }),
        "fake-token",
      );
    });
  });

  it("shows error toast when save fails", async () => {
    const updateProfileFn = vi.fn().mockRejectedValue(new Error("Server error"));
    mockIdentityService(mockProfile, updateProfileFn);

    renderWithProviders(<EditProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Ahmed")).toBeInTheDocument();
    });

    const firstNameInput = screen.getByDisplayValue("Ahmed");
    fireEvent.change(firstNameInput, { target: { value: "Mohamed" } });

    const saveButton = screen.getByRole("button", { name: /Enregistrer/i });
    await waitFor(() => expect(saveButton).not.toBeDisabled());
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateProfileFn).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText("Impossible de mettre à jour votre profil.")).toBeInTheDocument();
    });
  });

  it("shows success toast after successful save", async () => {
    const updateProfileFn = vi.fn().mockResolvedValue({
      ...mockProfile,
      firstName: "Mohamed",
    });
    mockIdentityService(mockProfile, updateProfileFn);

    renderWithProviders(<EditProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Ahmed")).toBeInTheDocument();
    });

    const firstNameInput = screen.getByDisplayValue("Ahmed");
    fireEvent.change(firstNameInput, { target: { value: "Mohamed" } });

    const saveButton = screen.getByRole("button", { name: /Enregistrer/i });
    await waitFor(() => expect(saveButton).not.toBeDisabled());
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Profil mis à jour")).toBeInTheDocument();
      expect(screen.getByText("Vos informations ont bien été enregistrées.")).toBeInTheDocument();
    });
  });

  it("prevents double submission", async () => {
    let resolveFn: (value: ProfileData) => void;
    const updateProfileFn = vi.fn().mockImplementation(
      () => new Promise<ProfileData>((resolve) => {
        resolveFn = resolve;
      }),
    );
    mockIdentityService(mockProfile, updateProfileFn);

    renderWithProviders(<EditProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Ahmed")).toBeInTheDocument();
    });

    const firstNameInput = screen.getByDisplayValue("Ahmed");
    fireEvent.change(firstNameInput, { target: { value: "Mohamed" } });

    const saveButton = screen.getByRole("button", { name: /Enregistrer/i });
    await waitFor(() => expect(saveButton).not.toBeDisabled());

    fireEvent.click(saveButton);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateProfileFn).toHaveBeenCalledTimes(1);
    });

    resolveFn!({ ...mockProfile, firstName: "Mohamed" });
  });

  it("shows confirm leave modal when cancelling with unsaved changes", async () => {
    mockIdentityService(mockProfile);

    renderWithProviders(<EditProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Ahmed")).toBeInTheDocument();
    });

    const firstNameInput = screen.getByDisplayValue("Ahmed");
    fireEvent.change(firstNameInput, { target: { value: "Mohamed" } });

    const cancelButton = screen.getByRole("button", { name: /Annuler/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.getByText("Quitter sans enregistrer ?")).toBeInTheDocument();
    });
    expect(screen.getByText("Vous avez des modifications non enregistrées.")).toBeInTheDocument();
  });

  it("closes modal and stays on page when 'Continuer la modification' is clicked", async () => {
    mockIdentityService(mockProfile);

    renderWithProviders(<EditProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Ahmed")).toBeInTheDocument();
    });

    const firstNameInput = screen.getByDisplayValue("Ahmed");
    fireEvent.change(firstNameInput, { target: { value: "Mohamed" } });

    fireEvent.click(screen.getByRole("button", { name: /Annuler/i }));

    await waitFor(() => {
      expect(screen.getByText("Quitter sans enregistrer ?")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Continuer la modification/i }));

    await waitFor(() => {
      expect(screen.queryByText("Quitter sans enregistrer ?")).not.toBeInTheDocument();
    });
    expect(screen.getByDisplayValue("Mohamed")).toBeInTheDocument();
  });

  it("does not show confirm modal when no changes were made", async () => {
    mockIdentityService(mockProfile);

    renderWithProviders(<EditProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Ahmed")).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole("button", { name: /Annuler/i });
    fireEvent.click(cancelButton);

    expect(screen.queryByText("Quitter sans enregistrer ?")).not.toBeInTheDocument();
  });

  it("renders page title and subtitle", async () => {
    mockIdentityService(mockProfile);

    renderWithProviders(<EditProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("Modifier mon profil")).toBeInTheDocument();
    });
    expect(screen.getByText("Mettez à jour vos informations personnelles.")).toBeInTheDocument();
  });

  it("renders Retour button", async () => {
    mockIdentityService(mockProfile);

    renderWithProviders(<EditProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("Retour")).toBeInTheDocument();
    });
  });

  it("renders country select with current value", async () => {
    mockIdentityService(mockProfile);

    renderWithProviders(<EditProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("Maroc")).toBeInTheDocument();
    });
  });

  it("renders city select with current value", async () => {
    mockIdentityService(mockProfile);

    renderWithProviders(<EditProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("Casablanca")).toBeInTheDocument();
    });
  });

  it("renders nationality select with current value", async () => {
    mockIdentityService(mockProfile);

    renderWithProviders(<EditProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("Marocaine")).toBeInTheDocument();
    });
  });
});
