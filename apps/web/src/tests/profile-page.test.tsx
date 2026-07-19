import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "@/features/auth/context/auth-context";
import { ToastProvider } from "@/components/ui/toaster";
import type { AuthContextValue } from "@/features/auth/context/auth-context";
import type { MeUser } from "@/features/auth/types/auth-types";
import { ProfilePage } from "@/features/identity/pages/ProfilePage";
import * as identityService from "@/features/identity/services/identity-service";
import type { ProfileData } from "@/features/identity/types/identity-types";

const { mockNavigate } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
}));
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockUser: MeUser = {
  id: "user-1",
  email: "john@example.com",
  firstName: "John",
  lastName: "Doe",
  role: "CLIENT",
  avatarUrl: null,
  authProvider: "LOCAL",
};

const mockProfile: ProfileData = {
  id: "user-1",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: null,
  country: null,
  city: null,
  nationality: null,
  preferredLanguage: null,
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

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders profile page with user data", async () => {
    vi.spyOn(identityService, "identityService", "get").mockReturnValue({
      getProfile: vi.fn().mockResolvedValue(mockProfile),
      updatePreferences: vi.fn(),
    });

    renderWithProviders(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
    expect(screen.getAllByText("john@example.com").length).toBeGreaterThan(0);
    expect(screen.getByText("Compte Grand Public")).toBeInTheDocument();
    expect(screen.getByText("Informations personnelles")).toBeInTheDocument();
    expect(screen.getByText("Préférences")).toBeInTheDocument();
    expect(screen.getByText("Sécurité du compte")).toBeInTheDocument();
  });

  it("shows loading skeleton while fetching", () => {
    vi.spyOn(identityService, "identityService", "get").mockReturnValue({
      getProfile: vi.fn().mockImplementation(() => new Promise(() => {})),
      updatePreferences: vi.fn(),
    });

    renderWithProviders(<ProfilePage />);

    expect(screen.getByLabelText("Chargement du profil")).toBeInTheDocument();
  });

  it("shows error message on fetch failure", async () => {
    vi.spyOn(identityService, "identityService", "get").mockReturnValue({
      getProfile: vi.fn().mockRejectedValue(new Error("Network error")),
      updatePreferences: vi.fn(),
    });

    renderWithProviders(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("Impossible de charger votre profil.")).toBeInTheDocument();
    });
    expect(screen.getByText("Réessayer")).toBeInTheDocument();
  });

  it("displays 'Non renseigné' for empty optional fields", async () => {
    vi.spyOn(identityService, "identityService", "get").mockReturnValue({
      getProfile: vi.fn().mockResolvedValue(mockProfile),
      updatePreferences: vi.fn(),
    });

    renderWithProviders(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getAllByText("Non renseigné").length).toBeGreaterThan(0);
    });
  });

  it("displays 'Maroc' for null country", async () => {
    vi.spyOn(identityService, "identityService", "get").mockReturnValue({
      getProfile: vi.fn().mockResolvedValue(mockProfile),
      updatePreferences: vi.fn(),
    });

    renderWithProviders(<ProfilePage />);

    await waitFor(() => {
      const countryRow = screen.getByText("Pays");
      const dd = countryRow.nextElementSibling;
      expect(dd).toHaveTextContent("Maroc");
    });
  });

  it("language selector calls updatePreferences on change", async () => {
    const updatePreferences = vi.fn().mockResolvedValue({
      ...mockProfile,
      preferredLanguage: "fr",
    });
    vi.spyOn(identityService, "identityService", "get").mockReturnValue({
      getProfile: vi.fn().mockResolvedValue(mockProfile),
      updatePreferences,
    });

    renderWithProviders(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("Français")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Français"));

    await waitFor(() => {
      expect(updatePreferences).toHaveBeenCalledWith(
        { preferredLanguage: "fr" },
        "fake-token",
      );
    });
  });

  it("notification email toggle calls updatePreferences on change", async () => {
    const updatePreferences = vi.fn().mockResolvedValue({
      ...mockProfile,
      notificationEmail: false,
    });
    vi.spyOn(identityService, "identityService", "get").mockReturnValue({
      getProfile: vi.fn().mockResolvedValue(mockProfile),
      updatePreferences,
    });

    renderWithProviders(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByLabelText("Notifications par e-mail")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText("Notifications par e-mail"));

    await waitFor(() => {
      expect(updatePreferences).toHaveBeenCalledWith(
        { notificationEmail: false },
        "fake-token",
      );
    });
  });

  it("notification push toggle calls updatePreferences on change", async () => {
    const updatePreferences = vi.fn().mockResolvedValue({
      ...mockProfile,
      notificationPush: false,
    });
    vi.spyOn(identityService, "identityService", "get").mockReturnValue({
      getProfile: vi.fn().mockResolvedValue(mockProfile),
      updatePreferences,
    });

    renderWithProviders(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByLabelText("Notifications push")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText("Notifications push"));

    await waitFor(() => {
      expect(updatePreferences).toHaveBeenCalledWith(
        { notificationPush: false },
        "fake-token",
      );
    });
  });

  it("shows toast on successful preference update", async () => {
    const updatePreferences = vi.fn().mockResolvedValue({
      ...mockProfile,
      preferredLanguage: "fr",
    });
    vi.spyOn(identityService, "identityService", "get").mockReturnValue({
      getProfile: vi.fn().mockResolvedValue(mockProfile),
      updatePreferences,
    });

    renderWithProviders(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("Français")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Français"));

    await waitFor(() => {
      expect(screen.getByText("Préférences enregistrées")).toBeInTheDocument();
    });
  });

  it('"Modifier mon profil" button navigates to /mon-compte/modifier', async () => {
    mockNavigate.mockClear();

    vi.spyOn(identityService, "identityService", "get").mockReturnValue({
      getProfile: vi.fn().mockResolvedValue(mockProfile),
      updatePreferences: vi.fn(),
    });

    renderWithProviders(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("Modifier mon profil")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Modifier mon profil"));

    expect(mockNavigate).toHaveBeenCalledWith("/mon-compte/modifier");
  });

  it('"Sécurité du compte" button navigates to /mon-compte/securite', async () => {
    mockNavigate.mockClear();

    vi.spyOn(identityService, "identityService", "get").mockReturnValue({
      getProfile: vi.fn().mockResolvedValue(mockProfile),
      updatePreferences: vi.fn(),
    });

    renderWithProviders(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("Sécurité du compte")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Sécurité du compte"));

    expect(mockNavigate).toHaveBeenCalledWith("/mon-compte/securite");
  });

  it("SMS toggle is disabled with 'Bientôt disponible' label", async () => {
    vi.spyOn(identityService, "identityService", "get").mockReturnValue({
      getProfile: vi.fn().mockResolvedValue(mockProfile),
      updatePreferences: vi.fn(),
    });

    renderWithProviders(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByLabelText("Notifications SMS")).toBeInTheDocument();
    });

    const smsToggle = screen.getByLabelText("Notifications SMS");
    expect(smsToggle).toBeDisabled();
    expect(screen.getByText("Bientôt disponible")).toBeInTheDocument();
  });

  it("profile summary shows initials avatar", async () => {
    vi.spyOn(identityService, "identityService", "get").mockReturnValue({
      getProfile: vi.fn().mockResolvedValue(mockProfile),
      updatePreferences: vi.fn(),
    });

    renderWithProviders(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByLabelText("Avatar: JD")).toBeInTheDocument();
    });
  });

  it("profile summary shows account type label for CLIENT role", async () => {
    vi.spyOn(identityService, "identityService", "get").mockReturnValue({
      getProfile: vi.fn().mockResolvedValue(mockProfile),
      updatePreferences: vi.fn(),
    });

    renderWithProviders(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("Compte Grand Public")).toBeInTheDocument();
    });
  });
});
