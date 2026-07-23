import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  LoadingSpinner,
  ErrorMessage,
  PrimaryButton,
  useGoogleLogin,
  initiateGoogleLogin,
} from "@/features/auth";
import { getOAuthState, clearOAuthState } from "@/features/auth/utils/oauth-storage";

type CallbackStatus = "processing" | "error" | "deleted";

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  access_denied: "Vous avez refusé la connexion avec Google.",
  invalid_request: "La requête Google est invalide. Veuillez réessayer.",
};

const DEFAULT_ERROR = "L'authentification Google a échoué. Veuillez réessayer.";

export function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<CallbackStatus>("processing");
  const [errorMessage, setErrorMessage] = useState("");
  const hasStarted = useRef(false);
  const recreateContext = useRef({ from: "/", professional: false });

  const googleLogin = useGoogleLogin({
    onSuccess: (user) => {
      const oauthState = getOAuthState();
      const from = oauthState?.from ?? "/";
      clearOAuthState();
      const dest = user.role === "PROFESSIONAL" ? "/pro/tableau-de-bord" : from;
      navigate(dest, { replace: true });
    },
    onError: (message, error) => {
      const stored = getOAuthState();
      recreateContext.current = {
        from: stored?.from ?? "/",
        professional: stored?.professional ?? false,
      };
      clearOAuthState();
      if (error?.code === "ACCOUNT_DELETED") {
        setErrorMessage(message);
        setStatus("deleted");
      } else {
        setErrorMessage(message);
        setStatus("error");
      }
    },
  });

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const oauthError = searchParams.get("error");

    if (oauthError) {
      clearOAuthState();
      const message = OAUTH_ERROR_MESSAGES[oauthError] ?? DEFAULT_ERROR;
      setErrorMessage(message);
      setStatus("error");
      return;
    }

    if (!code) {
      clearOAuthState();
      setErrorMessage(DEFAULT_ERROR);
      setStatus("error");
      return;
    }

    const stored = getOAuthState();

    if (!stored || stored.state !== state) {
      clearOAuthState();
      setErrorMessage("Session invalide. Veuillez réessayer.");
      setStatus("error");
      return;
    }

    googleLogin.mutate({
      code,
      codeVerifier: stored.codeVerifier,
      reactivate: stored.reactivate ?? false,
      professional: stored.professional ?? false,
    });
  }, [searchParams, googleLogin]);

  const handleBackToLogin = () => {
    navigate("/connexion", { replace: true, state: { googleError: errorMessage } });
  };

  const handleRecreate = () => {
    void initiateGoogleLogin(
      recreateContext.current.from,
      true,
      recreateContext.current.professional
    );
  };

  return (
    <AuthLayout>
      <AuthCard>
        <div className="flex flex-col items-center gap-5">
          {status === "processing" ? (
            <>
              <LoadingSpinner size="lg" />
              <p className="text-sm text-muted-foreground">Connexion à Google en cours...</p>
            </>
          ) : status === "deleted" ? (
            <>
              <AuthHeader title="Compte supprimé" description={errorMessage} />
              <PrimaryButton type="button" onClick={handleRecreate} className="w-full">
                Recréer mon compte
              </PrimaryButton>
              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Retour à la connexion
              </button>
            </>
          ) : (
            <>
              <AuthHeader title="Erreur d'authentification" />
              <ErrorMessage message={errorMessage} />
              <PrimaryButton type="button" onClick={handleBackToLogin} className="w-full">
                Retour à la connexion
              </PrimaryButton>
            </>
          )}
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
