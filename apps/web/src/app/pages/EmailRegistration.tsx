import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  TextField,
  EmailField,
  PasswordField,
  PasswordStrength,
  Checkbox,
  PrimaryButton,
  TextLink,
  ErrorMessage,
  registerSchema,
  useRegister,
  type RegisterFormData,
} from "@/features/auth";

export function EmailRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/";
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "", terms: false },
  });

  const password = watch("password");
  const registerMutation = useRegister({
    onSuccess: () => navigate(from, { replace: true }),
    onError: (message) => setServerError(message),
  });

  const onSubmit = handleSubmit((data) => {
    setServerError(null);
    registerMutation.mutate(data);
  });

  return (
    <AuthLayout>
      <AuthCard>
        <div className="flex flex-col gap-5">
          <AuthHeader title="Créer votre compte" />
          {serverError && <ErrorMessage message={serverError} />}
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <TextField
              label="Nom complet"
              name="fullName"
              register={register("fullName")}
              error={errors.fullName?.message}
              placeholder="Jean Dupont"
              autocomplete="name"
            />
            <EmailField register={register("email")} error={errors.email?.message} />
            <PasswordField register={register("password")} error={errors.password?.message} />
            <div className="-mt-1">
              <PasswordStrength value={password} />
            </div>
            <Checkbox
              label="J'accepte les Conditions et la Politique de confidentialité"
              name="terms"
              register={register("terms")}
              error={errors.terms?.message}
            />
            <PrimaryButton loading={registerMutation.isPending}>
              Créer mon compte
            </PrimaryButton>
          </form>
          <div className="flex justify-center">
            <TextLink to="/inscription">Retour</TextLink>
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
