import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PrimaryButton, useAuth } from "@/features/auth";
import { useToast } from "@/hooks/useToast";
import { Card } from "../components/Card";
import { ProInput } from "../components/ProInput";
import { ProSelect } from "../components/ProSelect";
import { ProTextarea } from "../components/ProTextarea";
import { ImageUploadSlot } from "../components/ImageUploadSlot";
import { StickyActionBar } from "../components/StickyActionBar";
import { useProfessionalProfile } from "../hooks/useProfessionalProfile";
import { useReferential } from "../hooks/useReferential";
import { useUpdateProfessionalProfile } from "../hooks/useUpdateProfessionalProfile";
import { professionalService } from "../services/professional-service";

interface FormState {
  firstName: string;
  lastName: string;
  professionalTitle: string;
  photoUrl: string | null;
  barAssociationId: string;
  bio: string;
}

const EMPTY: FormState = {
  firstName: "",
  lastName: "",
  professionalTitle: "",
  photoUrl: null,
  barAssociationId: "",
  bio: "",
};

export function ProfessionalProfilePage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { accessToken } = useAuth();
  const { data: profile, isLoading } = useProfessionalProfile();
  const { data: referential } = useReferential();
  const mutation = useUpdateProfessionalProfile();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [initial, setInitial] = useState<FormState>(EMPTY);

  useEffect(() => {
    if (profile) {
      const next: FormState = {
        firstName: profile.identity.firstName ?? "",
        lastName: profile.identity.lastName ?? "",
        professionalTitle: profile.identity.professionalTitle ?? "",
        photoUrl: profile.identity.photoUrl,
        barAssociationId: profile.identity.barAssociationId ?? "",
        bio: profile.biography.bio ?? "",
      };
      setForm(next);
      setInitial(next);
    }
  }, [profile]);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initial), [form, initial]);
  const canContinue = form.firstName.trim().length > 0 && form.lastName.trim().length > 0;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit() {
    mutation.mutate(
      {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        professionalTitle: form.professionalTitle.trim() || null,
        photoUrl: form.photoUrl,
        barAssociationId: form.barAssociationId || null,
        bio: form.bio.trim() || null,
      },
      {
        onSuccess: () => navigate("/pro/expertise"),
        onError: () => toast.showError("Impossible d'enregistrer votre profil."),
      }
    );
  }

  const barOptions =
    referential?.barAssociations.map((b) => ({ value: b.id, label: b.name })) ?? [];

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-[26px] font-bold tracking-[-0.02em] text-[#1C1B1A]">Mon profil</h1>
        <p className="mt-1 text-[14.5px] text-[#6B6862]">
          Ces informations constitueront votre présentation publique.
        </p>
      </header>

      <div className="flex flex-col gap-5">
        <Card title="Informations personnelles">
          <div className="flex flex-col gap-5">
            <ImageUploadSlot
              value={form.photoUrl}
              onUpload={(file) => professionalService.uploadPhoto(file, accessToken!)}
              onChange={(v) => update("photoUrl", v)}
              disabled={mutation.isPending}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ProInput
                label="Prénom"
                name="firstName"
                value={form.firstName}
                onChange={(v) => update("firstName", v)}
                placeholder="Amina"
                autoComplete="given-name"
                disabled={mutation.isPending}
                required
              />
              <ProInput
                label="Nom"
                name="lastName"
                value={form.lastName}
                onChange={(v) => update("lastName", v)}
                placeholder="El Fassi"
                autoComplete="family-name"
                disabled={mutation.isPending}
                required
              />
            </div>
          </div>
        </Card>

        <Card title="Informations professionnelles">
          <div className="flex flex-col gap-4">
            <ProInput
              label="Titre professionnel"
              name="professionalTitle"
              value={form.professionalTitle}
              onChange={(v) => update("professionalTitle", v)}
              placeholder="Avocate"
              disabled={mutation.isPending}
            />
            <ProSelect
              label="Barreau"
              name="barAssociationId"
              value={form.barAssociationId}
              options={barOptions}
              onChange={(v) => update("barAssociationId", v)}
              placeholder="Sélectionner un barreau"
              disabled={mutation.isPending}
            />
          </div>
        </Card>

        <Card title="Biographie">
          <ProTextarea
            label="Présentez votre parcours"
            name="bio"
            value={form.bio}
            onChange={(v) => update("bio", v)}
            placeholder="Décrivez votre expérience, vos domaines de prédilection…"
            maxLength={600}
            disabled={mutation.isPending}
          />
        </Card>
      </div>

      <StickyActionBar
        saved={!isDirty && !isLoading}
        status={
          isDirty ? "Modifications non enregistrées" : "Toutes les modifications sont enregistrées"
        }
      >
        <PrimaryButton
          type="button"
          onClick={handleSubmit}
          loading={mutation.isPending}
          disabled={!canContinue || mutation.isPending}
          className="w-auto px-6"
        >
          Enregistrer et continuer
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </PrimaryButton>
      </StickyActionBar>
    </div>
  );
}
