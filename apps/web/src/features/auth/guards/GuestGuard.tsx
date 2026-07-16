import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { SplashScreen } from "../components/SplashScreen";

export function GuestGuard() {
  const { status } = useAuth();

  if (status === "loading") {
    return <SplashScreen />;
  }

  if (status === "authenticated") {
    return <Navigate to="/" replace />;
  }

  if (status === "error") {
    return <SplashScreen />;
  }

  return <Outlet />;
}
