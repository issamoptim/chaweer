import { useLocation, useNavigate } from "react-router-dom";
import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  GoogleButton,
  Divider,
  PrimaryButton,
  TextLink,
  ProfessionalEntry,
  initiateGoogleLogin,
} from "@/features/auth";

export function Inscription() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/";

  return (
    <AuthLayout>
      <AuthCard>
        <div className="flex flex-col gap-5">
          <AuthHeader
            title="Créer votre compte"
            description="Quelques secondes suffisent."
          />
          <GoogleButton onClick={() => void initiateGoogleLogin(from)} />
          <Divider />
          <PrimaryButton onClick={() => navigate("/inscription/email")}>
            Continuer avec votre adresse e-mail
          </PrimaryButton>
          <div className="flex justify-center -mt-1">
            <TextLink to="/connexion">Se connecter</TextLink>
          </div>
          <ProfessionalEntry
            text="Vous êtes avocat ?"
            linkText="Rejoindre Chaweer en tant qu'avocat"
            to="/"
          />
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
