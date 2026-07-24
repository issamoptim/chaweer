import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, GraduationCap, Briefcase, Award } from "lucide-react";
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
import { useSetEducation } from "../hooks/useSetEducation";
import { useSetExperience } from "../hooks/useSetExperience";
import { useSetCertifications } from "../hooks/useSetCertifications";
import { professionalService } from "../services/professional-service";
import { resolveMediaUrl } from "@/utils/media-url";
import type {
  EducationData,
  ExperienceData,
  CertificationData,
  EducationInput,
  ExperienceInput,
  CertificationInput,
} from "../types/professional-types";

interface IdentityFormState {
  firstName: string;
  lastName: string;
  professionalTitle: string;
  registrationNumber: string;
  yearsOfExperience: string;
  photoUrl: string | null;
  barAssociationId: string;
  bio: string;
}

const EMPTY_IDENTITY: IdentityFormState = {
  firstName: "",
  lastName: "",
  professionalTitle: "",
  registrationNumber: "",
  yearsOfExperience: "",
  photoUrl: null,
  barAssociationId: "",
  bio: "",
};

interface EducationForm {
  degree: string;
  institution: string;
  startYear: string;
  endYear: string;
  description: string;
}

interface ExperienceForm {
  position: string;
  organization: string;
  startYear: string;
  endYear: string;
  current: boolean;
  description: string;
}

interface CertForm {
  title: string;
  issuer: string;
  issueYear: string;
  expiryYear: string;
  credentialId: string;
}

const EMPTY_EDU: EducationForm = { degree: "", institution: "", startYear: "", endYear: "", description: "" };
const EMPTY_EXP: ExperienceForm = { position: "", organization: "", startYear: "", endYear: "", current: false, description: "" };
const EMPTY_CERT: CertForm = { title: "", issuer: "", issueYear: "", expiryYear: "", credentialId: "" };

function eduToForm(e: EducationData): EducationForm {
  return { degree: e.degree, institution: e.institution, startYear: String(e.startYear), endYear: e.endYear ? String(e.endYear) : "", description: e.description ?? "" };
}
function expToForm(e: ExperienceData): ExperienceForm {
  return { position: e.position, organization: e.organization, startYear: String(e.startYear), endYear: e.endYear ? String(e.endYear) : "", current: e.current, description: e.description ?? "" };
}
function certToForm(c: CertificationData): CertForm {
  return { title: c.title, issuer: c.issuer, issueYear: String(c.issueYear), expiryYear: c.expiryYear ? String(c.expiryYear) : "", credentialId: c.credentialId ?? "" };
}

function isEduValid(f: EducationForm): boolean {
  return f.degree.trim() !== "" && f.institution.trim() !== "" && f.startYear !== "" && Number(f.startYear) > 0;
}
function isExpValid(f: ExperienceForm): boolean {
  return f.position.trim() !== "" && f.organization.trim() !== "" && f.startYear !== "" && Number(f.startYear) > 0;
}
function isCertValid(f: CertForm): boolean {
  return f.title.trim() !== "" && f.issuer.trim() !== "" && f.issueYear !== "" && Number(f.issueYear) > 0;
}

export function ProfessionalProfilePage() {
  const toast = useToast();
  const { accessToken } = useAuth();
  const { data: profile, isLoading } = useProfessionalProfile();
  const { data: referential } = useReferential();
  const identityMutation = useUpdateProfessionalProfile();
  const expertiseMutation = useUpdateExpertise();
  const eduMutation = useSetEducation();
  const expMutation = useSetExperience();
  const certMutation = useSetCertifications();

  const [isEditing, setIsEditing] = useState(false);
  const [identityForm, setIdentityForm] = useState<IdentityFormState>(EMPTY_IDENTITY);
  const [identityInitial, setIdentityInitial] = useState<IdentityFormState>(EMPTY_IDENTITY);
  const [languages, setLanguages] = useState<Set<string>>(new Set());
  const [initialLanguages, setInitialLanguages] = useState<Set<string>>(new Set());
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [eduForms, setEduForms] = useState<EducationForm[]>([]);
  const [eduInitial, setEduInitial] = useState<EducationForm[]>([]);
  const [expForms, setExpForms] = useState<ExperienceForm[]>([]);
  const [expInitial, setExpInitial] = useState<ExperienceForm[]>([]);
  const [certForms, setCertForms] = useState<CertForm[]>([]);
  const [certInitial, setCertInitial] = useState<CertForm[]>([]);

  useEffect(() => {
    if (profile) {
      const idNext: IdentityFormState = {
        firstName: profile.identity.firstName ?? "",
        lastName: profile.identity.lastName ?? "",
        professionalTitle: profile.identity.professionalTitle ?? "",
        registrationNumber: profile.identity.registrationNumber ?? "",
        yearsOfExperience: profile.identity.yearsOfExperience != null ? String(profile.identity.yearsOfExperience) : "",
        photoUrl: profile.identity.photoUrl,
        barAssociationId: profile.identity.barAssociationId ?? "",
        bio: profile.biography.bio ?? "",
      };
      setIdentityForm(idNext);
      setIdentityInitial(idNext);

      const langNext = new Set(profile.expertise.languageIds);
      setLanguages(langNext);
      setInitialLanguages(langNext);

      const eduNext = profile.education.map(eduToForm);
      setEduForms(eduNext);
      setEduInitial(eduNext);

      const expNext = profile.experience.map(expToForm);
      setExpForms(expNext);
      setExpInitial(expNext);

      const certNext = profile.certifications.map(certToForm);
      setCertForms(certNext);
      setCertInitial(certNext);
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
  const isEduDirty = useMemo(
    () => JSON.stringify(eduForms) !== JSON.stringify(eduInitial),
    [eduForms, eduInitial]
  );
  const isExpDirty = useMemo(
    () => JSON.stringify(expForms) !== JSON.stringify(expInitial),
    [expForms, expInitial]
  );
  const isCertDirty = useMemo(
    () => JSON.stringify(certForms) !== JSON.stringify(certInitial),
    [certForms, certInitial]
  );
  const isDirty = isIdentityDirty || isLanguagesDirty || isEduDirty || isExpDirty || isCertDirty;
  const isSaving = identityMutation.isPending || expertiseMutation.isPending || eduMutation.isPending || expMutation.isPending || certMutation.isPending;

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
    setEduForms(eduInitial);
    setExpForms(expInitial);
    setCertForms(certInitial);
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
              registrationNumber: identityForm.registrationNumber.trim() || null,
              yearsOfExperience: identityForm.yearsOfExperience.trim() ? Number(identityForm.yearsOfExperience) : null,
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

    if (isEduDirty) {
      const validEdu = eduForms.filter(isEduValid).map((f) => ({
        degree: f.degree.trim(),
        institution: f.institution.trim(),
        startYear: Number(f.startYear),
        endYear: f.endYear ? Number(f.endYear) : undefined,
        description: f.description.trim() || undefined,
      }));
      promises.push(eduMutation.mutateAsync(validEdu));
    }

    if (isExpDirty) {
      const validExp = expForms.filter(isExpValid).map((f) => ({
        position: f.position.trim(),
        organization: f.organization.trim(),
        startYear: Number(f.startYear),
        endYear: f.current ? undefined : f.endYear ? Number(f.endYear) : undefined,
        current: f.current,
        description: f.description.trim() || undefined,
      }));
      promises.push(expMutation.mutateAsync(validExp));
    }

    if (isCertDirty) {
      const validCerts = certForms.filter(isCertValid).map((f) => ({
        title: f.title.trim(),
        issuer: f.issuer.trim(),
        issueYear: Number(f.issueYear),
        expiryYear: f.expiryYear ? Number(f.expiryYear) : undefined,
        credentialId: f.credentialId.trim() || undefined,
      }));
      promises.push(certMutation.mutateAsync(validCerts));
    }

    try {
      await Promise.all(promises);
      setIdentityInitial(identityForm);
      setInitialLanguages(new Set(languages));
      setEduInitial(eduForms);
      setExpInitial(expForms);
      setCertInitial(certForms);
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
                <ProInput
                  label="N° d'inscription"
                  name="registrationNumber"
                  value={identityForm.registrationNumber}
                  onChange={(v) => updateIdentity("registrationNumber", v)}
                  placeholder="N° d'inscription au barreau"
                  disabled={isSaving}
                />
                <ProInput
                  label="Années d'expérience"
                  name="yearsOfExperience"
                  type="number"
                  value={identityForm.yearsOfExperience}
                  onChange={(v) => updateIdentity("yearsOfExperience", v)}
                  placeholder="8"
                  disabled={isSaving}
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
                <ReadField label="N° d'inscription" value={profile?.identity.registrationNumber} />
                <ReadField
                  label="Années d'expérience"
                  value={
                    profile?.identity.yearsOfExperience != null
                      ? `${profile.identity.yearsOfExperience} ans`
                      : undefined
                  }
                />
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

        {/* Carte 3 — Parcours : Formation */}
        <Card title={<span className="flex items-center gap-2"><GraduationCap className="h-[18px] w-[18px] text-[#0F766E]" /> Formation</span>}>
          {isEditing ? (
            <div className="flex flex-col gap-3">
              {eduForms.map((form, index) => (
                <div key={index} className="rounded-[12px] border border-[#EFEDE9] p-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <ProInput label="Diplôme" name={`edu-degree-${index}`} value={form.degree} onChange={(v) => { const n = [...eduForms]; n[index] = { ...form, degree: v }; setEduForms(n); }} placeholder="Master en droit" required disabled={isSaving} />
                    <ProInput label="Établissement" name={`edu-institution-${index}`} value={form.institution} onChange={(v) => { const n = [...eduForms]; n[index] = { ...form, institution: v }; setEduForms(n); }} placeholder="Université Mohammed V" required disabled={isSaving} />
                    <ProInput label="Année de début" name={`edu-start-${index}`} type="number" value={form.startYear} onChange={(v) => { const n = [...eduForms]; n[index] = { ...form, startYear: v }; setEduForms(n); }} placeholder="2015" required disabled={isSaving} />
                    <ProInput label="Année de fin" name={`edu-end-${index}`} type="number" value={form.endYear} onChange={(v) => { const n = [...eduForms]; n[index] = { ...form, endYear: v }; setEduForms(n); }} placeholder="2017" disabled={isSaving} />
                    <div className="sm:col-span-2">
                      <ProInput label="Description (optionnel)" name={`edu-desc-${index}`} value={form.description} onChange={(v) => { const n = [...eduForms]; n[index] = { ...form, description: v }; setEduForms(n); }} placeholder="Spécialisation, mention…" disabled={isSaving} />
                    </div>
                  </div>
                  {eduForms.length > 0 && (
                    <button type="button" onClick={() => setEduForms(eduForms.filter((_, i) => i !== index))} className="mt-3 flex items-center gap-1.5 text-[13px] font-medium text-[#B4231F] hover:underline">
                      <Trash2 className="h-3.5 w-3.5" /> Supprimer
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setEduForms([...eduForms, { ...EMPTY_EDU }])} className="flex items-center gap-2 rounded-[10px] border border-dashed border-[#CDE5E1] px-4 py-3 text-[14px] font-medium text-[#0F766E] transition-colors hover:bg-[#E6F2F0]">
                <Plus className="h-4 w-4" /> Ajouter une formation
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {(profile?.education ?? []).length > 0 ? profile!.education.map((e) => (
                <div key={e.id} className="flex flex-col gap-1 border-l-2 border-[#CDE5E1] pl-4">
                  <span className="text-[14.5px] font-semibold text-[#1C1B1A]">{e.degree}</span>
                  <span className="text-[13.5px] text-[#6B6862]">{e.institution}</span>
                  <span className="text-[12.5px] text-[#9A968E]">{e.startYear}{e.endYear ? ` — ${e.endYear}` : " — en cours"}</span>
                  {e.description && <p className="mt-0.5 text-[13px] text-[#4B4842]">{e.description}</p>}
                </div>
              )) : <p className="text-[14px] italic text-[#B4AFA6]">Aucune formation renseignée.</p>}
            </div>
          )}
        </Card>

        {/* Carte 4 — Parcours : Expérience */}
        <Card title={<span className="flex items-center gap-2"><Briefcase className="h-[18px] w-[18px] text-[#0F766E]" /> Expérience professionnelle</span>}>
          {isEditing ? (
            <div className="flex flex-col gap-3">
              {expForms.map((form, index) => (
                <div key={index} className="rounded-[12px] border border-[#EFEDE9] p-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <ProInput label="Poste" name={`exp-position-${index}`} value={form.position} onChange={(v) => { const n = [...expForms]; n[index] = { ...form, position: v }; setExpForms(n); }} placeholder="Avocat associé" required disabled={isSaving} />
                    <ProInput label="Organisation" name={`exp-org-${index}`} value={form.organization} onChange={(v) => { const n = [...expForms]; n[index] = { ...form, organization: v }; setExpForms(n); }} placeholder="Cabinet XYZ" required disabled={isSaving} />
                    <ProInput label="Année de début" name={`exp-start-${index}`} type="number" value={form.startYear} onChange={(v) => { const n = [...expForms]; n[index] = { ...form, startYear: v }; setExpForms(n); }} placeholder="2018" required disabled={isSaving} />
                    <ProInput label="Année de fin" name={`exp-end-${index}`} type="number" value={form.endYear} onChange={(v) => { const n = [...expForms]; n[index] = { ...form, endYear: v }; setExpForms(n); }} placeholder="2023" disabled={isSaving || form.current} />
                    <div className="sm:col-span-2">
                      <label className="flex items-center gap-2 text-[14px] font-medium text-[#1C1B1A]">
                        <input type="checkbox" checked={form.current} onChange={(e) => { const n = [...expForms]; n[index] = { ...form, current: e.target.checked, endYear: e.target.checked ? "" : form.endYear }; setExpForms(n); }} className="h-4 w-4 rounded border-[#E7E5E1] text-[#0F766E] focus:ring-[#0F766E]" />
                        Poste actuel
                      </label>
                    </div>
                    <div className="sm:col-span-2">
                      <ProInput label="Description (optionnel)" name={`exp-desc-${index}`} value={form.description} onChange={(v) => { const n = [...expForms]; n[index] = { ...form, description: v }; setExpForms(n); }} placeholder="Missions, responsabilités…" disabled={isSaving} />
                    </div>
                  </div>
                  {expForms.length > 0 && (
                    <button type="button" onClick={() => setExpForms(expForms.filter((_, i) => i !== index))} className="mt-3 flex items-center gap-1.5 text-[13px] font-medium text-[#B4231F] hover:underline">
                      <Trash2 className="h-3.5 w-3.5" /> Supprimer
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setExpForms([...expForms, { ...EMPTY_EXP }])} className="flex items-center gap-2 rounded-[10px] border border-dashed border-[#CDE5E1] px-4 py-3 text-[14px] font-medium text-[#0F766E] transition-colors hover:bg-[#E6F2F0]">
                <Plus className="h-4 w-4" /> Ajouter une expérience
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {(profile?.experience ?? []).length > 0 ? profile!.experience.map((e) => (
                <div key={e.id} className="flex flex-col gap-1 border-l-2 border-[#CDE5E1] pl-4">
                  <span className="text-[14.5px] font-semibold text-[#1C1B1A]">{e.position}</span>
                  <span className="text-[13.5px] text-[#6B6862]">{e.organization}</span>
                  <span className="text-[12.5px] text-[#9A968E]">{e.startYear}{e.endYear ? ` — ${e.endYear}` : e.current ? " — en cours" : ""}</span>
                  {e.description && <p className="mt-0.5 text-[13px] text-[#4B4842]">{e.description}</p>}
                </div>
              )) : <p className="text-[14px] italic text-[#B4AFA6]">Aucune expérience renseignée.</p>}
            </div>
          )}
        </Card>

        {/* Carte 5 — Certifications */}
        <Card title={<span className="flex items-center gap-2"><Award className="h-[18px] w-[18px] text-[#0F766E]" /> Certifications</span>}>
          {isEditing ? (
            <div className="flex flex-col gap-3">
              {certForms.map((form, index) => (
                <div key={index} className="rounded-[12px] border border-[#EFEDE9] p-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <ProInput label="Titre" name={`cert-title-${index}`} value={form.title} onChange={(v) => { const n = [...certForms]; n[index] = { ...form, title: v }; setCertForms(n); }} placeholder="Certification en droit fiscal" required disabled={isSaving} />
                    <ProInput label="Émetteur" name={`cert-issuer-${index}`} value={form.issuer} onChange={(v) => { const n = [...certForms]; n[index] = { ...form, issuer: v }; setCertForms(n); }} placeholder="Ordre des avocats" required disabled={isSaving} />
                    <ProInput label="Année d'obtention" name={`cert-issue-${index}`} type="number" value={form.issueYear} onChange={(v) => { const n = [...certForms]; n[index] = { ...form, issueYear: v }; setCertForms(n); }} placeholder="2020" required disabled={isSaving} />
                  </div>
                  {certForms.length > 0 && (
                    <button type="button" onClick={() => setCertForms(certForms.filter((_, i) => i !== index))} className="mt-3 flex items-center gap-1.5 text-[13px] font-medium text-[#B4231F] hover:underline">
                      <Trash2 className="h-3.5 w-3.5" /> Supprimer
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setCertForms([...certForms, { ...EMPTY_CERT }])} className="flex items-center gap-2 rounded-[10px] border border-dashed border-[#CDE5E1] px-4 py-3 text-[14px] font-medium text-[#0F766E] transition-colors hover:bg-[#E6F2F0]">
                <Plus className="h-4 w-4" /> Ajouter une certification
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {(profile?.certifications ?? []).length > 0 ? profile!.certifications.map((c) => (
                <div key={c.id} className="flex flex-col gap-1 border-l-2 border-[#CDE5E1] pl-4">
                  <span className="text-[14.5px] font-semibold text-[#1C1B1A]">{c.title}</span>
                  <span className="text-[13.5px] text-[#6B6862]">{c.issuer}</span>
                  <span className="text-[12.5px] text-[#9A968E]">{c.issueYear}</span>
                </div>
              )) : <p className="text-[14px] italic text-[#B4AFA6]">Aucune certification renseignée.</p>}
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
