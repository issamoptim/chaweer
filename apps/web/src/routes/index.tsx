import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { Home } from "@/app/pages/Home";
import { NotFound } from "@/app/pages/NotFound";
import { Connexion } from "@/app/pages/Connexion";
import { Inscription } from "@/app/pages/Inscription";
import { EmailRegistration } from "@/app/pages/EmailRegistration";
import { ForgotPasswordPage } from "@/app/pages/ForgotPasswordPage";
import { GoogleCallback } from "@/app/pages/GoogleCallback";
import { ProfilePage, EditProfilePage } from "@/features/identity";
import { SecurityPage } from "@/features/security";
import { AuthGuard, GuestGuard } from "@/features/auth";
import {
  ProfessionalGuard,
  ProfessionalLayout,
  ProfessionalRegistrationPage,
  ProfessionalLoginPage,
  ProfessionalProfilePage,
  ProfessionalExpertisePage,
  ProfessionalOfferPage,
  ProfessionalDashboardPage,
  ProfessionalContactPage,
  ProfessionalSecurityPage,
} from "@/features/professional";
import { PublicProfilePage } from "@/features/public";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/avocat/:id",
        element: <PublicProfilePage />,
      },
      {
        path: "/auth/google/callback",
        element: <GoogleCallback />,
      },
      {
        path: "/mot-de-passe-oublie",
        element: <ForgotPasswordPage />,
      },
      {
        element: <AuthGuard />,
        children: [
          {
            path: "/mon-compte",
            element: <ProfilePage />,
          },
          {
            path: "/mon-compte/modifier",
            element: <EditProfilePage />,
          },
          {
            path: "/mon-compte/securite",
            element: <SecurityPage />,
          },
        ],
      },
      {
        element: <GuestGuard />,
        children: [
          {
            path: "/connexion",
            element: <Connexion />,
          },
          {
            path: "/inscription",
            element: <Inscription />,
          },
          {
            path: "/inscription/email",
            element: <EmailRegistration />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "/pro/inscription",
    element: <ProfessionalRegistrationPage />,
  },
  {
    path: "/pro/connexion",
    element: <ProfessionalLoginPage />,
  },
  {
    element: <ProfessionalGuard />,
    children: [
      {
        element: <ProfessionalLayout />,
        children: [
          {
            path: "/pro/profil",
            element: <ProfessionalProfilePage />,
          },
          {
            path: "/pro/expertise",
            element: <ProfessionalExpertisePage />,
          },
          {
            path: "/pro/offre",
            element: <ProfessionalOfferPage />,
          },
          {
            path: "/pro/tableau-de-bord",
            element: <ProfessionalDashboardPage />,
          },
          {
            path: "/pro/contact",
            element: <ProfessionalContactPage />,
          },
          {
            path: "/pro/securite",
            element: <ProfessionalSecurityPage />,
          },
        ],
      },
    ],
  },
]);
