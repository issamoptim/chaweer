import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { Home } from "@/app/pages/Home";
import { NotFound } from "@/app/pages/NotFound";
import { Connexion } from "@/app/pages/Connexion";
import { Inscription } from "@/app/pages/Inscription";
import { MonCompte } from "@/app/pages/MonCompte";
import { AuthGuard, GuestGuard } from "@/features/auth";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        element: <AuthGuard />,
        children: [
          {
            path: "/mon-compte",
            element: <MonCompte />,
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
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
