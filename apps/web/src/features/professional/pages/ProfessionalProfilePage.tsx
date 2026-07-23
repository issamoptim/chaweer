import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/features/auth";
import { useToast } from "@/hooks/useToast";
import { Card } from "../components/Card";
import { ProInput } from "../components/ProInput";
import { ProSelect } from "../components/ProSelect";
import { ProTextarea } from "../components/ProTextarea";
import { ImageUploadSlot } from "../components/ImageUploadSlot";
import { Chip } from "../components/Chip";
import { ReadField } from "../components/ReadField";
import { EditPageHeader } from "../components/EditPageHeader";
import { EditActionBar } from "../components/EditActionBar";
import { SkeletonPage } from "../components/Skeleton";
import { useProfessionalProfile } from "../hooks/useProfessionalProfile";
import { useReferential } from "../hooks/useReferential";
import { useUpdateProfessionalProfile } from "../hooks/useUpdateProfessionalProfile";
import { useUpdateExpertise } from "../hooks/useUpdateExpertise";
import { professionalService } from "../services/professional-service";
import { resolveMediaUrl } from "@/utils/media-url";

interface IdentityFormState {
  firstName: string;
  lastName: string;
  professionalTitle: string;
  photoUrl: string | null;
  barAssociationId: string;
  bio: string;
}

const EMPTY_IDENTITY: IdentityFormState = {
  firstName: "",
  lastName: "",
  professionalTitle: "",
  photoUrl: null,
  barAssociationId: "",
  bio: "",
};

export function ProfessionalProfilePage() {
  const toast = useToast();
  const { accessToken } = useAuth();
  const { data: profile, isLoading } = useProfessionalProfile();
  const { data: referential } = useReferential();
  const identityMutation = useUpdateProfessionalProfile();
  const expertiseMutation = useUpdateExpertise();

  const [isEditing, setIsEditing] = useState(false);
  const [identityForm, setIdentityForm] = useState<IdentityFormState>(EMPTY_IDENTITY);
  const [identityInitial, setIdentityInitial] = useState<IdentityFormState>(EMPTY_IDENTITY);
  const [languages, setLanguages] = useState<Set<string>>(new Set());
  const [initialLanguages, setInitialLanguages] = useState<Set<string>>(new Set());
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (profile) {
      const idNext: IdentityFormState = {
        firstName: profile.identity.firstName ?? "",
        lastName: profile.identity.lastName ?? "",
        professionalTitle: profile.identity.professionalTitle ?? "",
        photoUrl: profile.identity.photoUrl,
        barAssociationId: profile.identity.barAssociationId ?? "",
        bio: profile.biography.bio ?? "",
      };
      setIdentityForm(idNext);
      setIdentityInitial(idNext);

      const langNext = new Set(profile.expertise.languageIds);
      setLanguages(langNext);
      setInitialLanguages(langNext);
    }
  }, [profile]);

  const isIdentityDirty = useMemo(
    () => JSON.stringify(identityForm) !== JSON.stringify(identityInitial),
    [identityForm, identityInitial]
  );
  const isLanguagesDirty = useMemo(
    () => JSON.stringify([...languages].sort()) !== JSON.stringify([...initialLanguages].sort()),
    [languages, initialLanguages]
  );
  const isDirty = isIdentityDirty || isLanguagesDirty;
  const isSaving = identityMutation.isPending || expertiseMutation.isPending;

  const canSaveIdentity =
    identityForm.firstName.trim().length > 0 &&
    identityForm.lastName.trim().length > 0 &&
    identityForm.barAssociationId.length > 0 &&
    identityForm.bio.trim().length >= 200;

  const barError =
    touched.barAssociationId && !identityForm.barAssociationId ? "Sélectionnez votre barreau" : null;
  const bioError =
    touched.bio && identityForm.bio.trim().length < 200 ? "Minimum 200 caractères" : null;

  function updateIdentity<K extends keyof IdentityFormState>(key: K, value: IdentityFormState[K]) {
    setIdentityForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleLanguage(id: string) {
    if (!isEditing) return;
    setLanguages((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleCancel() {
    setIdentityForm(identityInitial);
    setLanguages(initialLanguages);
    setTouched({});
    setIsEditing(false);
  }

  async function handleSave() {
    if (!isDirty) {
      setIsEditing(false);
      return;
    }

    const promises: Promise<unknown>[] = [];

    if (isIdentityDirty) {
      promises.push(
        new Promise((resolve, reject) => {
          identityMutation.mutate(
            {
              firstName: identityForm.firstName.trim(),
              lastName: identityForm.lastName.trim(),
              professionalTitle: identityForm.professionalTitle.trim() || null,
              photoUrl: identityForm.photoUrl,
              barAssociationId: identityForm.barAssociationId || null,
              bio: identityForm.bio.trim() || null,
            },
            { onSuccess: resolve, onError: reject }
          );
        })
      );
    }

    if (isLanguagesDirty) {
      promises.push(
        new Promise((resolve, reject) => {
          expertiseMutation.mutate(
            {
              specializationIds: profile?.expertise.specializationIds ?? [],
              practiceAreaIds: profile?.expertise.practiceAreaIds ?? [],
              languageIds: [...languages],
            },
            { onSuccess: resolve, onError: reject }
          );
        })
      );
    }

    try {
      await Promise.all(promises);
      setIdentityInitial(identityForm);
      setInitialLanguages(new Set(languages));
      toast.showSuccess("Modifications enregistrées.");
      setIsEditing(false);
    } catch {
      toast.showError("Impossible d'enregistrer votre profil.");
    }
  }

  const barOptions =
    referential?.barAssociations.map((b) => ({ value: b.id, label: b.name })) ?? [];
  const barName =
    referential?.barAssociations.find((b) => b.id === (profile?.identity.barAssociationId ?? identityForm.barAssociationId))?.name ?? null;
  const allLanguages = referential?.languages ?? [];
  const selectedLanguageNames = allLanguages
    .filter((l) => languages.has(l.id))
    .map((l) => l.name);

  if (isLoading) {
    return <SkeletonPage cards={3} />;
  }

  const fullName = `${profile?.identity.firstName ?? ""} ${profile?.identity.lastName ?? ""}`.trim();
  const initials = fullName
    ? `${profile?.identity.firstName?.[0] ?? ""}${profile?.identity.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  return (
    <div>
      <EditPageHeader
        title="Profil"
        subtitle="Qui vous êtes, tel que le public vous voit."
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
      />

      <div className="flex flex-col gap-5">
        {/* Carte 1 — Identité */}
        <Card title="Identité">
          {isEditing ? (
            <div className="flex flex-col gap-5">
              <ImageUploadSlot
                value={identityForm.photoUrl}
                onUpload={(file) => professionalService.uploadPhoto(file, accessToken!)}
                onChange={(v) => updateIdentity("photoUrl", v)}
                disabled={isSaving}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ProInput
                  label="Prénom"
                  name="firstName"
                  value={identityForm.firstName}
                  onChange={(v) => updateIdentity("firstName", v)}
                  placeholder="Amina"
                  autoComplete="given-name"
                  disabled={isSaving}
                  required
                />
                <ProInput
                  label="Nom"
                  name="lastName"
                  value={identityForm.lastName}
                  onChange={(v) => updateIdentity("lastName", v)}
                  placeholder="El Fassi"
                  autoComplete="family-name"
                  disabled={isSaving}
                  required
                />
                <ProInput
                  label="Titre professionnel"
                  name="professionalTitle"
                  value={identityForm.professionalTitle}
                  onChange={(v) => updateIdentity("professionalTitle", v)}
                  placeholder="Avocate"
                  disabled={isSaving}
                />
                <ProSelect
                  label="Barreau"
                  name="barAssociationId"
                  value={identityForm.barAssociationId}
                  options={barOptions}
                  onChange={(v) => updateIdentity("barAssociationId", v)}
                  placeholder="Sélectionner un barreau"
                  disabled={isSaving}
                  required
                  error={barError}
                  hint="Obligatoire pour la publication."
                  onBlur={() => setTouched((t) => ({ ...t, barAssociationId: true }))}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                {profile?.identity.photoUrl ? (
                  <img
                    src={resolveMediaUrl(profile.identity.photoUrl) ?? undefined}
                    alt={fullName}
                    className="h-[72px] w-[72px] rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#0F766E] text-[24px] font-bold text-white">
                    {initials}
                  </span>
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[19px] font-bold text-[#1C1B1A]">
                    {fullName || "Non renseigné"}
                  </span>
                  {profile?.identity.professionalTitle && (
                    <span className="text-[14px] text-[#6B6862]">
                      {profile.identity.professionalTitle}
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ReadField label="Prénom" value={profile?.identity.firstName} />
                <ReadField label="Nom" value={profile?.identity.lastName} />
                <ReadField label="Titre professionnel" value={profile?.identity.professionalTitle} />
                <ReadField label="Barreau" value={barName} />
              </div>
            </div>
          )}
        </Card>

        {/* Carte 2 — Présentation */}
        <Card title="Présentation">
          {isEditing ? (
            <div className="flex flex-col gap-5">
              <ProTextarea
                label="Biographie"
                name="bio"
                value={identityForm.bio}
                onChange={(v) => updateIdentity("bio", v)}
                placeholder="Présentez votre approche, vos succès notables, ce qui vous distingue…"
                maxLength={1000}
                minLength={200}
                rows={5}
                disabled={isSaving}
                required
                error={bioError}
                hint="200 caractères minimum. Décrivez votre approche et ce qui vous distingue."
                onBlur={() => setTouched((t) => ({ ...t, bio: true }))}
              />
              <div className="flex flex-col gap-3">
                <span className="text-[13.5px] font-semibold text-[#1C1B1A]">Langues</span>
                {allLanguages.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                    {allLanguages.map((lang) => (
                      <Chip
                        key={lang.id}
                        label={lang.name}
                        selected={languages.has(lang.id)}
                        onToggle={() => toggleLanguage(lang.id)}
                        disabled={isSaving}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-[13.5px] text-[#9A968E]">Aucune langue disponible.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-semibold uppercase tracking-wide text-[#9A968E]">
                  Biographie
                </span>
                {profile?.biography.bio && profile.biography.bio.trim() ? (
                  <p className="whitespace-pre-wrap text-[14.5px] leading-[1.65] text-[#1C1B1A]">
                    {profile.biography.bio}
                  </p>
                ) : (
                  <p className="text-[14.5px] italic text-[#B4AFA6]">Non renseigné</p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-semibold uppercase tracking-wide text-[#9A968E]">
                  Langues
                </span>
                {selectedLanguageNames.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedLanguageNames.map((name) => (
                      <span
                        key={name}
                        className="rounded-full border border-[#CDE5E1] bg-[#E6F2F0] px-3 py-1 text-[13px] font-medium text-[#0F766E]"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[14.5px] italic text-[#B4AFA6]">Non renseigné</p>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>

      <EditActionBar
        isEditing={isEditing}
        isSaving={isSaving}
        canSave={!isIdentityDirty || canSaveIdentity}
        onSave={handleSave}
        onCancel={handleCancel}
        status={isDirty ? "Modifications non enregistrées" : undefined}
      />
    </div>
  );
}
