import { useEffect, useState } from "react";
import { Plus, Trash2, Award, Users } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { Card } from "../components/Card";
import { ProInput } from "../components/ProInput";
import { EditPageHeader } from "../components/EditPageHeader";
import { EditActionBar } from "../components/EditActionBar";
import { SkeletonPage } from "../components/Skeleton";
import { useProfessionalProfile } from "../hooks/useProfessionalProfile";
import { useSetCertifications } from "../hooks/useSetCertifications";
import { useSetMemberships } from "../hooks/useSetMemberships";
import type {
  CertificationData,
  MembershipData,
  CertificationInput,
  MembershipInput,
} from "../types/professional-types";

interface CertForm {
  title: string;
  issuer: string;
  issueYear: string;
  expiryYear: string;
  credentialId: string;
}

interface MemberForm {
  organization: string;
  role: string;
  startYear: string;
  endYear: string;
}

const EMPTY_CERT: CertForm = {
  title: "",
  issuer: "",
  issueYear: "",
  expiryYear: "",
  credentialId: "",
};

const EMPTY_MEMBER: MemberForm = {
  organization: "",
  role: "",
  startYear: "",
  endYear: "",
};

function certToForm(c: CertificationData): CertForm {
  return {
    title: c.title,
    issuer: c.issuer,
    issueYear: String(c.issueYear),
    expiryYear: c.expiryYear ? String(c.expiryYear) : "",
    credentialId: c.credentialId ?? "",
  };
}

function memberToForm(m: MembershipData): MemberForm {
  return {
    organization: m.organization,
    role: m.role ?? "",
    startYear: String(m.startYear),
    endYear: m.endYear ? String(m.endYear) : "",
  };
}

function formToCertInput(f: CertForm): CertificationInput {
  return {
    title: f.title.trim(),
    issuer: f.issuer.trim(),
    issueYear: Number(f.issueYear),
    expiryYear: f.expiryYear ? Number(f.expiryYear) : undefined,
    credentialId: f.credentialId.trim() || undefined,
  };
}

function formToMemberInput(f: MemberForm): MembershipInput {
  return {
    organization: f.organization.trim(),
    role: f.role.trim() || undefined,
    startYear: Number(f.startYear),
    endYear: f.endYear ? Number(f.endYear) : undefined,
  };
}

function isCertValid(f: CertForm): boolean {
  return f.title.trim() !== "" && f.issuer.trim() !== "" && f.issueYear !== "" && Number(f.issueYear) > 0;
}

function isMemberValid(f: MemberForm): boolean {
  return f.organization.trim() !== "" && f.startYear !== "" && Number(f.startYear) > 0;
}

export function ProfessionalCredentialsPage() {
  const toast = useToast();
  const { data: profile, isLoading } = useProfessionalProfile();
  const certMutation = useSetCertifications();
  const memberMutation = useSetMemberships();

  const [isEditing, setIsEditing] = useState(false);
  const [certForms, setCertForms] = useState<CertForm[]>([]);
  const [memberForms, setMemberForms] = useState<MemberForm[]>([]);

  useEffect(() => {
    if (profile) {
      setCertForms(profile.certifications.map(certToForm));
      setMemberForms(profile.memberships.map(memberToForm));
    }
  }, [profile]);

  function handleEdit() {
    if (profile) {
      setCertForms(profile.certifications.length > 0 ? profile.certifications.map(certToForm) : [{ ...EMPTY_CERT }]);
      setMemberForms(profile.memberships.length > 0 ? profile.memberships.map(memberToForm) : [{ ...EMPTY_MEMBER }]);
    } else {
      setCertForms([{ ...EMPTY_CERT }]);
      setMemberForms([{ ...EMPTY_MEMBER }]);
    }
    setIsEditing(true);
  }

  function handleCancel() {
    if (profile) {
      setCertForms(profile.certifications.map(certToForm));
      setMemberForms(profile.memberships.map(memberToForm));
    }
    setIsEditing(false);
  }

  function handleSave() {
    if (!profile) return;

    const validCerts = certForms.filter(isCertValid);
    const validMembers = memberForms.filter(isMemberValid);

    Promise.all([
      certMutation.mutateAsync(validCerts.map(formToCertInput)),
      memberMutation.mutateAsync(validMembers.map(formToMemberInput)),
    ])
      .then(() => {
        toast.showSuccess("Certifications et affiliations enregistrées.");
        setIsEditing(false);
      })
      .catch(() => {
        toast.showError("Impossible d'enregistrer.");
      });
  }

  if (isLoading) {
    return <SkeletonPage />;
  }

  const isSaving = certMutation.isPending || memberMutation.isPending;

  return (
    <div className="mx-auto max-w-[860px] px-4 py-8 sm:px-8">
      <EditPageHeader
        title="Certifications & affiliations"
        subtitle="Vos certifications professionnelles et vos affiliations à des organisations."
        isEditing={isEditing}
        onEdit={handleEdit}
      />

      {/* Certifications */}
      <div className="mb-6">
        <h2 className="mb-3 flex items-center gap-2 text-[15px] font-bold text-[#1C1B1A]">
          <Award className="h-5 w-5 text-[#0F766E]" />
          Certifications
        </h2>

        {!isEditing && (profile?.certifications ?? []).length === 0 && (
          <Card title="" description="">
            <p className="text-[14px] italic text-[#B4AFA6]">Aucune certification renseignée.</p>
          </Card>
        )}

        {!isEditing && (profile?.certifications ?? []).length > 0 && (
          <div className="space-y-3">
            {profile!.certifications.map((c) => (
              <Card key={c.id} title="" description="">
                <div className="flex flex-col gap-1">
                  <span className="text-[15px] font-semibold text-[#1C1B1A]">{c.title}</span>
                  <span className="text-[14px] text-[#6B6862]">{c.issuer}</span>
                  <span className="text-[13px] text-[#9A968E]">
                    {c.issueYear}{c.expiryYear ? ` — ${c.expiryYear}` : ""}
                  </span>
                  {c.credentialId && (
                    <span className="text-[13px] text-[#9A968E]">Réf : {c.credentialId}</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {isEditing && (
          <div className="space-y-3">
            {certForms.map((form, index) => (
              <Card key={index} title="" description="">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ProInput
                    label="Titre"
                    name={`cert-title-${index}`}
                    value={form.title}
                    onChange={(v) => {
                      const next = [...certForms];
                      next[index] = { ...form, title: v };
                      setCertForms(next);
                    }}
                    placeholder="Certification en droit fiscal"
                    required
                  />
                  <ProInput
                    label="Émetteur"
                    name={`cert-issuer-${index}`}
                    value={form.issuer}
                    onChange={(v) => {
                      const next = [...certForms];
                      next[index] = { ...form, issuer: v };
                      setCertForms(next);
                    }}
                    placeholder="Ordre des avocats"
                    required
                  />
                  <ProInput
                    label="Année d'obtention"
                    name={`cert-issue-${index}`}
                    type="number"
                    value={form.issueYear}
                    onChange={(v) => {
                      const next = [...certForms];
                      next[index] = { ...form, issueYear: v };
                      setCertForms(next);
                    }}
                    placeholder="2020"
                    required
                  />
                  <ProInput
                    label="Année d'expiration"
                    name={`cert-expiry-${index}`}
                    type="number"
                    value={form.expiryYear}
                    onChange={(v) => {
                      const next = [...certForms];
                      next[index] = { ...form, expiryYear: v };
                      setCertForms(next);
                    }}
                    placeholder="2025 (vide si sans expiration)"
                  />
                  <div className="sm:col-span-2">
                    <ProInput
                      label="Référence (optionnel)"
                      name={`cert-cred-${index}`}
                      value={form.credentialId}
                      onChange={(v) => {
                        const next = [...certForms];
                        next[index] = { ...form, credentialId: v };
                        setCertForms(next);
                      }}
                      placeholder="N° de référence"
                    />
                  </div>
                </div>
                {certForms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setCertForms(certForms.filter((_, i) => i !== index))}
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
              onClick={() => setCertForms([...certForms, { ...EMPTY_CERT }])}
              className="flex items-center gap-2 rounded-[10px] border border-dashed border-[#CDE5E1] px-4 py-3 text-[14px] font-medium text-[#0F766E] transition-colors hover:bg-[#E6F2F0]"
            >
              <Plus className="h-4 w-4" />
              Ajouter une certification
            </button>
          </div>
        )}
      </div>

      {/* Memberships */}
      <div className="mb-6">
        <h2 className="mb-3 flex items-center gap-2 text-[15px] font-bold text-[#1C1B1A]">
          <Users className="h-5 w-5 text-[#0F766E]" />
          Affiliations
        </h2>

        {!isEditing && (profile?.memberships ?? []).length === 0 && (
          <Card title="" description="">
            <p className="text-[14px] italic text-[#B4AFA6]">Aucune affiliation renseignée.</p>
          </Card>
        )}

        {!isEditing && (profile?.memberships ?? []).length > 0 && (
          <div className="space-y-3">
            {profile!.memberships.map((m) => (
              <Card key={m.id} title="" description="">
                <div className="flex flex-col gap-1">
                  <span className="text-[15px] font-semibold text-[#1C1B1A]">{m.organization}</span>
                  {m.role && <span className="text-[14px] text-[#6B6862]">{m.role}</span>}
                  <span className="text-[13px] text-[#9A968E]">
                    {m.startYear}{m.endYear ? ` — ${m.endYear}` : " — en cours"}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {isEditing && (
          <div className="space-y-3">
            {memberForms.map((form, index) => (
              <Card key={index} title="" description="">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ProInput
                    label="Organisation"
                    name={`member-org-${index}`}
                    value={form.organization}
                    onChange={(v) => {
                      const next = [...memberForms];
                      next[index] = { ...form, organization: v };
                      setMemberForms(next);
                    }}
                    placeholder="Association des avocats"
                    required
                  />
                  <ProInput
                    label="Rôle (optionnel)"
                    name={`member-role-${index}`}
                    value={form.role}
                    onChange={(v) => {
                      const next = [...memberForms];
                      next[index] = { ...form, role: v };
                      setMemberForms(next);
                    }}
                    placeholder="Membre du conseil"
                  />
                  <ProInput
                    label="Année de début"
                    name={`member-start-${index}`}
                    type="number"
                    value={form.startYear}
                    onChange={(v) => {
                      const next = [...memberForms];
                      next[index] = { ...form, startYear: v };
                      setMemberForms(next);
                    }}
                    placeholder="2019"
                    required
                  />
                  <ProInput
                    label="Année de fin"
                    name={`member-end-${index}`}
                    type="number"
                    value={form.endYear}
                    onChange={(v) => {
                      const next = [...memberForms];
                      next[index] = { ...form, endYear: v };
                      setMemberForms(next);
                    }}
                    placeholder="2023 (vide si en cours)"
                  />
                </div>
                {memberForms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setMemberForms(memberForms.filter((_, i) => i !== index))}
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
              onClick={() => setMemberForms([...memberForms, { ...EMPTY_MEMBER }])}
              className="flex items-center gap-2 rounded-[10px] border border-dashed border-[#CDE5E1] px-4 py-3 text-[14px] font-medium text-[#0F766E] transition-colors hover:bg-[#E6F2F0]"
            >
              <Plus className="h-4 w-4" />
              Ajouter une affiliation
            </button>
          </div>
        )}
      </div>

      <EditActionBar
        isEditing={isEditing}
        isSaving={isSaving}
        canSave={true}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
