import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  GoogleButton,
  Divider,
  EmailField,
  PasswordField,
  PrimaryButton,
  TextLink,
  ProfessionalEntry,
  ErrorMessage,
  loginSchema,
  useLogin,
  initiateGoogleLogin,
  type LoginFormData,
} from "@/features/auth";

export function Connexion() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/";
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const loginMutation = useLogin({
    onSuccess: (user) => {
      const dest = user.role === "PROFESSIONAL" ? "/pro/tableau-de-bord" : from;
      navigate(dest, { replace: true });
    },
    onError: (message) => setServerError(message),
  });

  const onSubmit = handleSubmit((data) => {
    setServerError(null);
    loginMutation.mutate(data);
  });

  return (
    <AuthLayout>
      <AuthCard>
        <div className="flex flex-col gap-5">
          <AuthHeader
            title="Connectez-vous à Chaweer"
            description="Entrez vos identifiants pour accéder à votre espace"
          />
          <GoogleButton onClick={() => void initiateGoogleLogin(from)} />
          <Divider />
          {serverError && <ErrorMessage message={serverError} />}
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <EmailField register={register("email")} error={errors.email?.message} />
            <PasswordField register={register("password")} error={errors.password?.message} />
            <PrimaryButton loading={loginMutation.isPending}>Se connecter</PrimaryButton>
          </form>
          <div className="flex flex-col items-center gap-2">
            <TextLink to="/connexion">Mot de passe oublié</TextLink>
            <TextLink to="/inscription">Créer un compte</TextLink>
          </div>
          <ProfessionalEntry
            text="Vous êtes avocat ?"
            linkText="Accéder à l'espace avocat"
            to="/"
          />
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
