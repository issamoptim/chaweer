import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordField, PrimaryButton } from "@/features/auth";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useChangePassword } from "../hooks/useChangePassword";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "../schemas/change-password-schema";

export function PasswordCard() {
  const toast = useToast();
  const { accessToken } = useAuth();
  const mutation = useChangePassword({
    onSuccess: () => {
      toast.showSuccess("Votre mot de passe a été modifié.");
      reset();
    },
    onError: (message) => {
      toast.showError(message);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const isSaving = isSubmitting || mutation.isPending;

  function onSubmit(data: ChangePasswordFormData) {
    if (!accessToken) return;
    mutation.mutate({ data, token: accessToken });
  }

  return (
    <section
      aria-labelledby="password-card-title"
      className="rounded-[16px] border border-[#E9E7E3] bg-card p-7 shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)]"
    >
      <h3 id="password-card-title" className="mb-4 text-[17px] font-bold text-foreground">
        Mot de passe
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[18px]" noValidate>
        <PasswordField
          id="currentPassword"
          label="Mot de passe actuel"
          autoComplete="current-password"
          register={register("currentPassword")}
          error={errors.currentPassword?.message}
          disabled={isSaving}
        />
        <PasswordField
          id="newPassword"
          label="Nouveau mot de passe"
          autoComplete="new-password"
          register={register("newPassword")}
          error={errors.newPassword?.message}
          disabled={isSaving}
        />
        <p className="text-[12.5px] text-[#9A968E] -mt-[10px]">
          8 caractères minimum, avec au moins une lettre et un chiffre.
        </p>
        <PasswordField
          id="confirmPassword"
          label="Confirmer le nouveau mot de passe"
          autoComplete="new-password"
          register={register("confirmPassword")}
          error={errors.confirmPassword?.message}
          disabled={isSaving}
        />
        <div className="flex justify-end">
          <PrimaryButton type="submit" loading={isSaving} disabled={isSaving} className="w-auto">
            {isSaving ? "Modification…" : "Modifier le mot de passe"}
          </PrimaryButton>
        </div>
      </form>
    </section>
  );
}
