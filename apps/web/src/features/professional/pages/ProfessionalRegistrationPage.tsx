import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GoogleButton,
  Divider,
  TextField,
  PasswordField,
  PrimaryButton,
  ErrorMessage,
  TextLink,
  initiateGoogleLogin,
  useAuth,
} from "@/features/auth";
import { ProBadge } from "../components/ProBadge";
import { useProfessionalRegister } from "../hooks/useProfessionalRegister";
import {
  professionalRegisterSchema,
  type ProfessionalRegisterFormData,
} from "../schemas/professional-register-schema";

const ONBOARDING_START = "/pro/profil";

export function ProfessionalRegistrationPage() {
  const navigate = useNavigate();
  const { user, status } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const isExistingClient = status === "authenticated" && user?.role === "CLIENT";

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ProfessionalRegisterFormData>({
    resolver: zodResolver(professionalRegisterSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const registerMutation = useProfessionalRegister({
    onSuccess: () => navigate(ONBOARDING_START, { replace: true }),
    onError: (message) => setServerError(message),
  });

  const onSubmit = handleSubmit((data) => {
    setServerError(null);
    registerMutation.mutate(data);
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F7F5] px-4 py-12">
      <div className="w-full max-w-[440px] rounded-[20px] border border-[#E9E7E3] bg-white p-10 shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)]">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-[22px] font-bold tracking-tight text-[#0F766E]">Chaweer</span>
          <ProBadge />
          <h1 className="mt-2 text-[22px] font-bold text-[#1C1B1A]">
            Créer votre compte professionnel
          </h1>
          <p className="text-[14px] text-[#6B6862]">
            Rejoignez Chaweer et proposez vos consultations juridiques.
          </p>
        </div>

        {isExistingClient && (
          <div className="mt-5 rounded-lg border border-[#0F766E]/20 bg-[#0F766E]/5 px-4 py-3">
            <p className="text-[13px] leading-relaxed text-[#0F766E]">
              Vous êtes actuellement connecté en tant que client
              {user?.email ? ` (${user.email})` : ""}. En continuant, votre compte sera transformé
              en compte professionnel. Vos données existantes (rendez-vous, historique, profil)
              seront conservées.
            </p>
          </div>
        )}

        {serverError && (
          <div className="mt-5">
            <ErrorMessage message={serverError} />
          </div>
        )}

        <div className="mt-6">
          <GoogleButton onClick={() => void initiateGoogleLogin(ONBOARDING_START, false, true)} />
        </div>

        <div className="my-5">
          <Divider />
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <TextField
            label="E-mail professionnel"
            name="email"
            type="email"
            register={register("email")}
            error={errors.email?.message}
            placeholder="vous@cabinet.com"
            autocomplete="email"
          />
          <div>
            <PasswordField
              register={register("password")}
              error={errors.password?.message}
              label="Mot de passe"
              autoComplete="new-password"
            />
            <p className="mt-2 text-[12.5px] text-[#9A968E]">
              8 caractères minimum, avec au moins une lettre et un chiffre.
            </p>
          </div>
          <PasswordField
            id="confirmPassword"
            register={register("confirmPassword")}
            error={errors.confirmPassword?.message}
            label="Confirmer le mot de passe"
            autoComplete="new-password"
          />
          <PrimaryButton
            type="submit"
            loading={registerMutation.isPending}
            disabled={!isValid || registerMutation.isPending}
          >
            {registerMutation.isPending ? "Création du compte…" : "Créer mon compte professionnel"}
          </PrimaryButton>
        </form>

        <div className="mt-5 flex justify-center">
          <TextLink to="/connexion">Vous avez déjà un compte ? Se connecter</TextLink>
        </div>

        <div className="mt-6 border-t border-[#EFEDE9] pt-4 text-center">
          <p className="text-[13px] text-[#6B6862]">
            Vous êtes un particulier ?{" "}
            <TextLink to="/inscription">Retour à l'espace grand public</TextLink>
          </p>
        </div>

        <p className="mt-4 text-center text-[11.5px] leading-relaxed text-[#9A968E]">
          En créant un compte, vous acceptez nos Conditions d'utilisation et notre Politique de
          confidentialité.
        </p>
      </div>
    </div>
  );
}
