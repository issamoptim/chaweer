import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GoogleButton,
  Divider,
  EmailField,
  PasswordField,
  PrimaryButton,
  TextLink,
  ErrorMessage,
  loginSchema,
  useLogin,
  initiateGoogleLogin,
  type LoginFormData,
} from "@/features/auth";
import { ProBadge } from "../components/ProBadge";
import { ChaweerLogo } from "@/components/ChaweerLogo";

const PRO_DASHBOARD = "/pro/tableau-de-bord";

export function ProfessionalLoginPage() {
  const navigate = useNavigate();
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
      const dest = user.role === "PROFESSIONAL" ? PRO_DASHBOARD : "/";
      navigate(dest, { replace: true });
    },
    onError: (message) => setServerError(message),
  });

  const onSubmit = handleSubmit((data) => {
    setServerError(null);
    loginMutation.mutate(data);
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F7F5] px-4 py-12">
      <div className="w-full max-w-[440px] rounded-[20px] border border-[#E9E7E3] bg-white p-10 shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)]">
        <div className="flex flex-col items-center gap-3 text-center">
          <ChaweerLogo size="md" showArabic={false} />
          <ProBadge />
          <h1 className="mt-2 text-[22px] font-bold text-[#1C1B1A]">
            Accédez à votre espace professionnel
          </h1>
          <p className="text-[14px] leading-relaxed text-[#6B6862]">
            Gérez vos consultations, développez votre visibilité et pilotez votre activité sur
            Chaweer.
          </p>
        </div>

        {serverError && (
          <div className="mt-5">
            <ErrorMessage message={serverError} />
          </div>
        )}

        <div className="mt-6">
          <GoogleButton onClick={() => void initiateGoogleLogin(PRO_DASHBOARD, false, true)} />
        </div>

        <div className="my-5">
          <Divider />
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <EmailField register={register("email")} error={errors.email?.message} />
          <PasswordField register={register("password")} error={errors.password?.message} />
          <PrimaryButton loading={loginMutation.isPending}>Se connecter</PrimaryButton>
        </form>

        <div className="mt-4 flex justify-center">
          <TextLink to="/mot-de-passe-oublie">Mot de passe oublié</TextLink>
        </div>

        <div className="mt-5 flex justify-center">
          <TextLink to="/pro/inscription">Pas encore inscrit ? Créer un compte professionnel</TextLink>
        </div>

        <div className="mt-6 border-t border-[#EFEDE9] pt-4 text-center">
          <p className="text-[13px] text-[#6B6862]">
            Vous êtes un particulier ?{" "}
            <TextLink to="/connexion">Retour à l'espace grand public</TextLink>
          </p>
        </div>
      </div>
    </div>
  );
}
