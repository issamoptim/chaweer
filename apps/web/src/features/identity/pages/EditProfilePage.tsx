import { useState, useEffect, useRef } from "react";
import { useNavigate, useBlocker } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check } from "lucide-react";
import { TextField, PrimaryButton, SecondaryButton, ErrorMessage } from "@/features/auth";
import { AppHeader } from "@/components/AppHeader";
import { useProfile } from "../hooks/useProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useToast } from "@/hooks/useToast";
import { editProfileSchema, type EditProfileFormData } from "../schemas/edit-profile-schema";
import { COUNTRIES, NATIONALITIES, CITIES_BY_COUNTRY } from "../constants/reference-data";
import { SelectField } from "../components/SelectField";
import { ReadOnlyField } from "../components/ReadOnlyField";
import { EditProfileSkeleton } from "../components/EditProfileSkeleton";
import { ConfirmLeaveModal } from "../components/ConfirmLeaveModal";
import type { UpdateProfileInput } from "../types/identity-types";

export function EditProfilePage() {
  const navigate = useNavigate();
  const { data: profile, isLoading, isError, refetch } = useProfile();
  const mutation = useUpdateProfile();
  const toast = useToast();
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const pendingNavigationRef = useRef<(() => void) | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
  });

  const watchedValues = watch();

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        phone: profile.phone ?? "",
        country: (profile.country ?? "") as EditProfileFormData["country"],
        city: profile.city ?? "",
        nationality: (profile.nationality ?? "") as EditProfileFormData["nationality"],
      });
    }
  }, [profile, reset]);

  const initialValues = profile
    ? {
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        phone: profile.phone ?? "",
        country: profile.country ?? "",
        city: profile.city ?? "",
        nationality: profile.nationality ?? "",
      }
    : null;

  const isDirty =
    initialValues !== null &&
    (watchedValues.firstName !== initialValues.firstName ||
      watchedValues.lastName !== initialValues.lastName ||
      watchedValues.phone !== initialValues.phone ||
      watchedValues.country !== initialValues.country ||
      watchedValues.city !== initialValues.city ||
      watchedValues.nationality !== initialValues.nationality);

  const isSaving = mutation.isPending || isSubmitting;

  useBlocker(isDirty && !isSaving);

  function handleCountryChange(value: string) {
    setValue("country", (value || null) as EditProfileFormData["country"], { shouldDirty: true });
    setValue("city", null, { shouldDirty: true });
  }

  function handleCityChange(value: string) {
    setValue("city", value || null, { shouldDirty: true });
  }

  function handleNationalityChange(value: string) {
    setValue("nationality", (value || null) as EditProfileFormData["nationality"], {
      shouldDirty: true,
    });
  }

  function handleCancel() {
    if (isDirty && !isSaving) {
      setShowConfirmLeave(true);
      pendingNavigationRef.current = () => navigate("/mon-compte");
    } else {
      navigate("/mon-compte");
    }
  }

  function handleStay() {
    setShowConfirmLeave(false);
    pendingNavigationRef.current = null;
  }

  function handleLeave() {
    setShowConfirmLeave(false);
    pendingNavigationRef.current?.();
    pendingNavigationRef.current = null;
  }

  const onSubmit = handleSubmit((data) => {
    const payload: UpdateProfileInput = {
      firstName: data.firstName?.trim() || null,
      lastName: data.lastName?.trim() || null,
      phone: data.phone?.trim() || null,
      country: data.country || null,
      city: data.city || null,
      nationality: data.nationality || null,
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        setShowConfirmation(true);
      },
      onError: () => {
        toast.showError("Impossible de mettre à jour votre profil.");
      },
    });
  });

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-white">
        <AppHeader />
        <div className="mx-auto max-w-[520px] px-6 py-16 flex flex-col items-center text-center">
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#0F766E]">
            <Check className="h-8 w-8 text-white" strokeWidth={3} />
          </div>
          <h1 className="mt-6 text-[22px] font-bold text-foreground">Profil mis à jour</h1>
          <p className="mt-2 text-[15px] text-[#6B6862]">
            Vos informations ont bien été enregistrées.
          </p>
          <PrimaryButton
            onClick={() => navigate("/mon-compte")}
            className="mt-8 w-full max-w-[280px]"
          >
            Retour à mon profil
          </PrimaryButton>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <EditProfileSkeleton />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white">
        <AppHeader />
        <div className="mx-auto max-w-[760px] px-6 pt-8 pb-16 flex flex-col gap-[22px]">
          <h1 className="text-[28px] font-bold tracking-[-0.02em] leading-[1.15] text-foreground">
            Modifier mon profil
          </h1>
          <ErrorMessage message="Impossible de charger votre profil." />
          <SecondaryButton onClick={() => refetch()} className="w-auto px-[26px]">
            Réessayer
          </SecondaryButton>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const cityOptions = CITIES_BY_COUNTRY[watchedValues.country ?? ""] ?? [];

  return (
    <div className="min-h-screen bg-white">
      <AppHeader />
      <div className="mx-auto max-w-[760px] px-6 pt-8 pb-16 flex flex-col gap-[22px]">
        <div>
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center gap-[7px] text-[13.5px] font-semibold text-[#0F766E] transition-colors hover:underline"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
            Retour
          </button>
          <h1 className="mt-3 text-[28px] font-bold tracking-[-0.02em] leading-[1.15] text-foreground">
            Modifier mon profil
          </h1>
          <p className="mt-1 text-[14.5px] text-[#6B6862]">
            Mettez à jour vos informations personnelles.
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-[22px]">
          <div className="rounded-[16px] border border-[#E9E7E3] bg-card p-7 flex flex-col gap-[20px] shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)]">
            <TextField
              label="Prénom"
              name="firstName"
              register={register("firstName")}
              error={errors.firstName?.message}
              disabled={isSaving}
              placeholder="Ahmed"
              labelMarginBottom="mb-[7px]"
              borderWidth="border-[1.5px]"
              paddingX="px-[15px]"
              focusRingClass="focus:border-[#0F766E] focus:outline-none focus:ring-[3px] focus:ring-[rgba(20,184,166,0.40)]"
              errorTextClass="text-[13px] text-[#B4231F] mt-[7px]"
            />
            <TextField
              label="Nom"
              name="lastName"
              register={register("lastName")}
              error={errors.lastName?.message}
              disabled={isSaving}
              placeholder="Benali"
              labelMarginBottom="mb-[7px]"
              borderWidth="border-[1.5px]"
              paddingX="px-[15px]"
              focusRingClass="focus:border-[#0F766E] focus:outline-none focus:ring-[3px] focus:ring-[rgba(20,184,166,0.40)]"
              errorTextClass="text-[13px] text-[#B4231F] mt-[7px]"
            />

            <ReadOnlyField label="Email" value={profile.email} />

            <TextField
              label="Téléphone"
              name="phone"
              type="tel"
              register={register("phone")}
              error={errors.phone?.message}
              disabled={isSaving}
              placeholder="+212 6 00 00 00 00"
              autocomplete="tel"
              labelMarginBottom="mb-[7px]"
              borderWidth="border-[1.5px]"
              paddingX="px-[15px]"
              focusRingClass="focus:border-[#0F766E] focus:outline-none focus:ring-[3px] focus:ring-[rgba(20,184,166,0.40)]"
              errorTextClass="text-[13px] text-[#B4231F] mt-[7px]"
            />

            <div>
              <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
                <SelectField
                  label="Pays"
                  name="country"
                  value={watchedValues.country ?? ""}
                  options={COUNTRIES}
                  onChange={handleCountryChange}
                  disabled={isSaving}
                  error={errors.country?.message}
                />
                <SelectField
                  label="Ville"
                  name="city"
                  value={watchedValues.city ?? ""}
                  options={cityOptions}
                  onChange={handleCityChange}
                  disabled={isSaving || !watchedValues.country}
                  error={errors.city?.message}
                  placeholder="Sélectionner une ville"
                />
              </div>
              <p className="mt-[7px] text-[12.5px] text-[#9A968E]">
                La ville dépend du pays sélectionné.
              </p>
            </div>

            <SelectField
              label="Nationalité"
              name="nationality"
              value={watchedValues.nationality ?? ""}
              options={NATIONALITIES}
              onChange={handleNationalityChange}
              disabled={isSaving}
              error={errors.nationality?.message}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-3">
            <SecondaryButton
              onClick={handleCancel}
              disabled={isSaving}
              className="sm:w-auto sm:px-[26px]"
            >
              Annuler
            </SecondaryButton>
            <PrimaryButton
              type="submit"
              loading={isSaving}
              disabled={!isDirty || isSaving}
              className="sm:w-auto sm:px-[30px]"
            >
              {isSaving ? "Enregistrement…" : "Enregistrer les modifications"}
            </PrimaryButton>
          </div>
        </form>

        <ConfirmLeaveModal open={showConfirmLeave} onStay={handleStay} onLeave={handleLeave} />
      </div>
    </div>
  );
}
