import { useEffect, useState } from "react";
import { Plus, Trash2, GraduationCap, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { Card } from "../components/Card";
import { ProInput } from "../components/ProInput";
import { EditPageHeader } from "../components/EditPageHeader";
import { EditActionBar } from "../components/EditActionBar";
import { SkeletonPage } from "../components/Skeleton";
import { useProfessionalProfile } from "../hooks/useProfessionalProfile";
import { useSetEducation } from "../hooks/useSetEducation";
import { useSetExperience } from "../hooks/useSetExperience";
import type {
  EducationData,
  ExperienceData,
  EducationInput,
  ExperienceInput,
} from "../types/professional-types";

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

const EMPTY_EDU: EducationForm = {
  degree: "",
  institution: "",
  startYear: "",
  endYear: "",
  description: "",
};

const EMPTY_EXP: ExperienceForm = {
  position: "",
  organization: "",
  startYear: "",
  endYear: "",
  current: false,
  description: "",
};

function eduToForm(e: EducationData): EducationForm {
  return {
    degree: e.degree,
    institution: e.institution,
    startYear: String(e.startYear),
    endYear: e.endYear ? String(e.endYear) : "",
    description: e.description ?? "",
  };
}

function expToForm(e: ExperienceData): ExperienceForm {
  return {
    position: e.position,
    organization: e.organization,
    startYear: String(e.startYear),
    endYear: e.endYear ? String(e.endYear) : "",
    current: e.current,
    description: e.description ?? "",
  };
}

function formToEduInput(f: EducationForm): EducationInput {
  return {
    degree: f.degree.trim(),
    institution: f.institution.trim(),
    startYear: Number(f.startYear),
    endYear: f.endYear ? Number(f.endYear) : undefined,
    description: f.description.trim() || undefined,
  };
}

function formToExpInput(f: ExperienceForm): ExperienceInput {
  return {
    position: f.position.trim(),
    organization: f.organization.trim(),
    startYear: Number(f.startYear),
    endYear: f.current ? undefined : f.endYear ? Number(f.endYear) : undefined,
    current: f.current,
    description: f.description.trim() || undefined,
  };
}

function isEduValid(f: EducationForm): boolean {
  return f.degree.trim() !== "" && f.institution.trim() !== "" && f.startYear !== "" && Number(f.startYear) > 0;
}

function isExpValid(f: ExperienceForm): boolean {
  return f.position.trim() !== "" && f.organization.trim() !== "" && f.startYear !== "" && Number(f.startYear) > 0;
}

export function ProfessionalBackgroundPage() {
  const toast = useToast();
  const { data: profile, isLoading } = useProfessionalProfile();
  const eduMutation = useSetEducation();
  const expMutation = useSetExperience();

  const [isEditing, setIsEditing] = useState(false);
  const [eduForms, setEduForms] = useState<EducationForm[]>([]);
  const [expForms, setExpForms] = useState<ExperienceForm[]>([]);

  useEffect(() => {
    if (profile) {
      setEduForms(profile.education.map(eduToForm));
      setExpForms(profile.experience.map(expToForm));
    }
  }, [profile]);

  function handleEdit() {
    if (profile) {
      setEduForms(profile.education.length > 0 ? profile.education.map(eduToForm) : [{ ...EMPTY_EDU }]);
      setExpForms(profile.experience.length > 0 ? profile.experience.map(expToForm) : [{ ...EMPTY_EXP }]);
    } else {
      setEduForms([{ ...EMPTY_EDU }]);
      setExpForms([{ ...EMPTY_EXP }]);
    }
    setIsEditing(true);
  }

  function handleCancel() {
    if (profile) {
      setEduForms(profile.education.map(eduToForm));
      setExpForms(profile.experience.map(expToForm));
    }
    setIsEditing(false);
  }

  function handleSave() {
    if (!profile) return;

    const validEdu = eduForms.filter(isEduValid);
    const validExp = expForms.filter(isExpValid);

    Promise.all([
      eduMutation.mutateAsync(validEdu.map(formToEduInput)),
      expMutation.mutateAsync(validExp.map(formToExpInput)),
    ])
      .then(() => {
        toast.showSuccess("Parcours enregistré avec succès.");
        setIsEditing(false);
      })
      .catch(() => {
        toast.showError("Impossible d'enregistrer votre parcours.");
      });
  }

  if (isLoading) {
    return <SkeletonPage />;
  }

  const isSaving = eduMutation.isPending || expMutation.isPending;
  const canSave = true;

  return (
    <div className="mx-auto max-w-[860px] px-4 py-8 sm:px-8">
      <EditPageHeader
        title="Parcours"
        subtitle="Votre formation et votre expérience professionnelle."
        isEditing={isEditing}
        onEdit={handleEdit}
      />

      {/* Education */}
      <div className="mb-6">
        <h2 className="mb-3 flex items-center gap-2 text-[15px] font-bold text-[#1C1B1A]">
          <GraduationCap className="h-5 w-5 text-[#0F766E]" />
          Formation
        </h2>

        {!isEditing && (profile?.education ?? []).length === 0 && (
          <Card title="" description="">
            <p className="text-[14px] italic text-[#B4AFA6]">Aucune formation renseignée.</p>
          </Card>
        )}

        {!isEditing && (profile?.education ?? []).length > 0 && (
          <div className="space-y-3">
            {profile!.education.map((e) => (
              <Card key={e.id} title="" description="">
                <div className="flex flex-col gap-1">
                  <span className="text-[15px] font-semibold text-[#1C1B1A]">{e.degree}</span>
                  <span className="text-[14px] text-[#6B6862]">{e.institution}</span>
                  <span className="text-[13px] text-[#9A968E]">
                    {e.startYear}{e.endYear ? ` — ${e.endYear}` : " — en cours"}
                  </span>
                  {e.description && (
                    <p className="mt-1 text-[13.5px] text-[#4B4842]">{e.description}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {isEditing && (
          <div className="space-y-3">
            {eduForms.map((form, index) => (
              <Card key={index} title="" description="">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ProInput
                    label="Diplôme"
                    name={`edu-degree-${index}`}
                    value={form.degree}
                    onChange={(v) => {
                      const next = [...eduForms];
                      next[index] = { ...form, degree: v };
                      setEduForms(next);
                    }}
                    placeholder="Master en droit"
                    required
                  />
                  <ProInput
                    label="Établissement"
                    name={`edu-institution-${index}`}
                    value={form.institution}
                    onChange={(v) => {
                      const next = [...eduForms];
                      next[index] = { ...form, institution: v };
                      setEduForms(next);
                    }}
                    placeholder="Université Mohammed V"
                    required
                  />
                  <ProInput
                    label="Année de début"
                    name={`edu-start-${index}`}
                    type="number"
                    value={form.startYear}
                    onChange={(v) => {
                      const next = [...eduForms];
                      next[index] = { ...form, startYear: v };
                      setEduForms(next);
                    }}
                    placeholder="2015"
                    required
                  />
                  <ProInput
                    label="Année de fin"
                    name={`edu-end-${index}`}
                    type="number"
                    value={form.endYear}
                    onChange={(v) => {
                      const next = [...eduForms];
                      next[index] = { ...form, endYear: v };
                      setEduForms(next);
                    }}
                    placeholder="2017 (vide si en cours)"
                  />
                  <div className="sm:col-span-2">
                    <ProInput
                      label="Description (optionnel)"
                      name={`edu-desc-${index}`}
                      value={form.description}
                      onChange={(v) => {
                        const next = [...eduForms];
                        next[index] = { ...form, description: v };
                        setEduForms(next);
                      }}
                      placeholder="Spécialisation, mention…"
                    />
                  </div>
                </div>
                {eduForms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setEduForms(eduForms.filter((_, i) => i !== index))}
                    className="mt-3 flex items-center gap-1.5 text-[13px] font-medium text-[#B4231F] hover:underline"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Supprimer
                  </button>
                )}
              </Card>
            ))}
            <button
              type="button"
              onClick={() => setEduForms([...eduForms, { ...EMPTY_EDU }])}
              className="flex items-center gap-2 rounded-[10px] border border-dashed border-[#CDE5E1] px-4 py-3 text-[14px] font-medium text-[#0F766E] transition-colors hover:bg-[#E6F2F0]"
            >
              <Plus className="h-4 w-4" />
              Ajouter une formation
            </button>
          </div>
        )}
      </div>

      {/* Experience */}
      <div className="mb-6">
        <h2 className="mb-3 flex items-center gap-2 text-[15px] font-bold text-[#1C1B1A]">
          <Briefcase className="h-5 w-5 text-[#0F766E]" />
          Expérience professionnelle
        </h2>

        {!isEditing && (profile?.experience ?? []).length === 0 && (
          <Card title="" description="">
            <p className="text-[14px] italic text-[#B4AFA6]">Aucune expérience renseignée.</p>
          </Card>
        )}

        {!isEditing && (profile?.experience ?? []).length > 0 && (
          <div className="space-y-3">
            {profile!.experience.map((e) => (
              <Card key={e.id} title="" description="">
                <div className="flex flex-col gap-1">
                  <span className="text-[15px] font-semibold text-[#1C1B1A]">{e.position}</span>
                  <span className="text-[14px] text-[#6B6862]">{e.organization}</span>
                  <span className="text-[13px] text-[#9A968E]">
                    {e.startYear}{e.endYear ? ` — ${e.endYear}` : e.current ? " — en cours" : ""}
                  </span>
                  {e.description && (
                    <p className="mt-1 text-[13.5px] text-[#4B4842]">{e.description}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {isEditing && (
          <div className="space-y-3">
            {expForms.map((form, index) => (
              <Card key={index} title="" description="">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ProInput
                    label="Poste"
                    name={`exp-position-${index}`}
                    value={form.position}
                    onChange={(v) => {
                      const next = [...expForms];
                      next[index] = { ...form, position: v };
                      setExpForms(next);
                    }}
                    placeholder="Avocat associé"
                    required
                  />
                  <ProInput
                    label="Organisation"
                    name={`exp-org-${index}`}
                    value={form.organization}
                    onChange={(v) => {
                      const next = [...expForms];
                      next[index] = { ...form, organization: v };
                      setExpForms(next);
                    }}
                    placeholder="Cabinet XYZ"
                    required
                  />
                  <ProInput
                    label="Année de début"
                    name={`exp-start-${index}`}
                    type="number"
                    value={form.startYear}
                    onChange={(v) => {
                      const next = [...expForms];
                      next[index] = { ...form, startYear: v };
                      setExpForms(next);
                    }}
                    placeholder="2018"
                    required
                  />
                  <ProInput
                    label="Année de fin"
                    name={`exp-end-${index}`}
                    type="number"
                    value={form.endYear}
                    onChange={(v) => {
                      const next = [...expForms];
                      next[index] = { ...form, endYear: v };
                      setExpForms(next);
                    }}
                    placeholder="2023 (vide si en cours)"
                    disabled={form.current}
                  />
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-2 text-[14px] font-medium text-[#1C1B1A]">
                      <input
                        type="checkbox"
                        checked={form.current}
                        onChange={(e) => {
                          const next = [...expForms];
                          next[index] = { ...form, current: e.target.checked, endYear: e.target.checked ? "" : form.endYear };
                          setExpForms(next);
                        }}
                        className="h-4 w-4 rounded border-[#E7E5E1] text-[#0F766E] focus:ring-[#0F766E]"
                      />
                      Poste actuel
                    </label>
                  </div>
                  <div className="sm:col-span-2">
                    <ProInput
                      label="Description (optionnel)"
                      name={`exp-desc-${index}`}
                      value={form.description}
                      onChange={(v) => {
                        const next = [...expForms];
                        next[index] = { ...form, description: v };
                        setExpForms(next);
                      }}
                      placeholder="Missions, responsabilités…"
                    />
                  </div>
                </div>
                {expForms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setExpForms(expForms.filter((_, i) => i !== index))}
                    className="mt-3 flex items-center gap-1.5 text-[13px] font-medium text-[#B4231F] hover:underline"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Supprimer
                  </button>
                )}
              </Card>
            ))}
            <button
              type="button"
              onClick={() => setExpForms([...expForms, { ...EMPTY_EXP }])}
              className="flex items-center gap-2 rounded-[10px] border border-dashed border-[#CDE5E1] px-4 py-3 text-[14px] font-medium text-[#0F766E] transition-colors hover:bg-[#E6F2F0]"
            >
              <Plus className="h-4 w-4" />
              Ajouter une expérience
            </button>
          </div>
        )}
      </div>

      <EditActionBar
        isEditing={isEditing}
        isSaving={isSaving}
        canSave={canSave}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
