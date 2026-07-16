import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { SplashScreen } from "../components/SplashScreen";

export function AuthGuard() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return <SplashScreen />;
  }

  if (status === "anonymous") {
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
