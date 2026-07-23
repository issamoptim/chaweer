import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Linkedin,
  Video,
  Phone as PhoneIcon,
  MessageCircle,
  Clock,
  ArrowLeft,
  GraduationCap,
  Briefcase,
  Award,
  Users,
  Scale,
  Languages,
  Pencil,
} from "lucide-react";
import { usePublicProfile } from "../hooks/usePublicProfile";
import { resolveMediaUrl } from "@/utils/media-url";
import { ChaweerLogo } from "@/components/ChaweerLogo";
import { useProfessionalProfile } from "@/features/professional/hooks/useProfessionalProfile";

const MODALITY_LABELS: Record<string, { label: string; icon: typeof Video }> = {
  VIDEO: { label: "Visioconférence", icon: Video },
  AUDIO: { label: "Téléphone", icon: PhoneIcon },
  CHAT: { label: "Messagerie", icon: MessageCircle },
};

function getInitials(firstName: string, lastName: string): string {
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
}

export function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data: profile, isLoading, isError } = usePublicProfile(id);
  const { data: myProfile } = useProfessionalProfile();
  const isOwner = !!profile && !!myProfile && profile.id === myProfile.id;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F7F5]">
        <PublicHeader />
        <div className="mx-auto max-w-[840px] px-6 py-10 flex flex-col gap-6">
          <div className="h-48 w-full animate-pulse rounded-[20px] bg-[#E9E7E3]" />
          <div className="h-32 w-full animate-pulse rounded-[16px] bg-[#E9E7E3]" />
          <div className="h-48 w-full animate-pulse rounded-[16px] bg-[#E9E7E3]" />
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-screen bg-[#F7F7F5]">
        <PublicHeader />
        <div className="mx-auto max-w-[840px] px-6 py-20 flex flex-col items-center text-center">
          <Scale className="h-12 w-12 text-[#B4AFA6]" />
          <h1 className="mt-4 text-[22px] font-bold text-[#1C1B1A]">
            Profil introuvable
          </h1>
          <p className="mt-2 text-[14.5px] text-[#6B6862]">
            Ce profil n'est pas disponible ou n'est plus publié.
          </p>
          <Link
            to="/"
            className="mt-6 flex h-[42px] items-center rounded-[10px] bg-[#0F766E] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#134E4A]"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const fullName = `${profile.identity.firstName} ${profile.identity.lastName}`;
  const initials = getInitials(profile.identity.firstName, profile.identity.lastName);
  const offer = profile.offers[0] ?? null;

  return (
    <div className="min-h-screen bg-[#F7F7F5]">
      <PublicHeader />

      <div className="mx-auto max-w-[840px] px-6 py-8 flex flex-col gap-6">
        <Link
          to="/"
          className="inline-flex items-center gap-[7px] text-[13.5px] font-semibold text-[#0F766E] transition-colors hover:underline w-fit"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
          Retour
        </Link>

        {/* Hero card — identity + photo */}
        <div className="rounded-[20px] bg-white border border-[#E9E7E3] p-7 shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            {profile.identity.photoUrl ? (
              <img
                src={resolveMediaUrl(profile.identity.photoUrl) ?? undefined}
                alt={fullName}
                className="h-[96px] w-[96px] rounded-full object-cover shrink-0"
              />
            ) : (
              <span className="flex h-[96px] w-[96px] shrink-0 items-center justify-center rounded-full bg-[#0F766E] text-[32px] font-bold text-white">
                {initials}
              </span>
            )}

            <div className="flex flex-col gap-2 flex-1">
              <h1 className="text-[26px] font-extrabold tracking-[-0.02em] text-[#1C1B1A]">
                {fullName}
              </h1>
              {profile.identity.professionalTitle && (
                <p className="text-[15px] font-medium text-[#0F766E]">
                  {profile.identity.professionalTitle}
                </p>
              )}
              <div className="flex flex-wrap gap-3 mt-1">
                {profile.barAssociationName && (
                  <span className="inline-flex items-center gap-1.5 text-[13px] text-[#6B6862]">
                    <Scale className="h-3.5 w-3.5" />
                    {profile.barAssociationName}
                  </span>
                )}
                {profile.identity.yearsOfExperience != null && (
                  <span className="inline-flex items-center gap-1.5 text-[13px] text-[#6B6862]">
                    <Briefcase className="h-3.5 w-3.5" />
                    {profile.identity.yearsOfExperience} ans d'expérience
                  </span>
                )}
                {profile.cityName && (
                  <span className="inline-flex items-center gap-1.5 text-[13px] text-[#6B6862]">
                    <MapPin className="h-3.5 w-3.5" />
                    {profile.cityName}
                  </span>
                )}
              </div>
            </div>

            {isOwner && (
              <Link
                to="/pro/profil"
                className="shrink-0 flex h-[40px] items-center gap-2 rounded-[10px] border border-[#E7E5E1] bg-white px-4 text-[13px] font-semibold text-[#0F766E] transition-colors hover:bg-[#F0FAF8]"
              >
                <Pencil className="h-4 w-4" />
                Modifier mon profil
              </Link>
            )}
          </div>
        </div>

        {/* Biographie */}
        {profile.biography.bio && profile.biography.bio.trim() && (
          <Section title="À propos">
            <p className="text-[14.5px] leading-[1.7] text-[#4B4842] whitespace-pre-line">
              {profile.biography.bio}
            </p>
          </Section>
        )}

        {/* Expertise */}
        {(profile.specializationNames.length > 0 || profile.practiceAreaNames.length > 0) && (
          <Section title="Expertise">
            <div className="flex flex-col gap-4">
              {profile.specializationNames.length > 0 && (
                <div>
                  <span className="text-[12px] font-semibold uppercase tracking-wide text-[#9A968E]">
                    Domaines
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {profile.specializationNames.map((name) => (
                      <span
                        key={name}
                        className="rounded-full bg-[#E6F2F0] px-3 py-1 text-[12.5px] font-medium text-[#0F766E]"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {profile.practiceAreaNames.length > 0 && (
                <div>
                  <span className="text-[12px] font-semibold uppercase tracking-wide text-[#9A968E]">
                    Situations
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {profile.practiceAreaNames.map((name) => (
                      <span
                        key={name}
                        className="rounded-full bg-[#F7F7F5] border border-[#E9E7E3] px-3 py-1 text-[12.5px] font-medium text-[#4B4842]"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Langues */}
        {profile.languageNames.length > 0 && (
          <Section title="Langues">
            <div className="flex items-center gap-2 flex-wrap">
              <Languages className="h-4 w-4 text-[#9A968E]" />
              {profile.languageNames.map((name) => (
                <span
                  key={name}
                  className="text-[13.5px] font-medium text-[#4B4842]"
                >
                  {name}
                </span>
              )).reduce((acc: React.ReactNode[], el, i) => {
                if (i > 0) acc.push(<span key={`sep-${i}`} className="text-[#B4AFA6]">·</span>);
                acc.push(el);
                return acc;
              }, [])}
            </div>
          </Section>
        )}

        {/* Offre de consultation */}
        {offer && (
          <Section title="Consultation">
            <div className="rounded-[16px] bg-[#F0FAF8] border border-[#B8E4DF] p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[16px] font-bold text-[#1C1B1A]">{offer.title}</h3>
                  {offer.description && (
                    <p className="text-[13.5px] leading-[1.6] text-[#6B6862]">
                      {offer.description}
                    </p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-[22px] font-extrabold text-[#0F766E]">
                    {offer.price} {offer.currency}
                  </span>
                  {offer.durationMinutes > 0 && (
                    <div className="flex items-center gap-1 text-[12px] text-[#9A968E]">
                      <Clock className="h-3 w-3" />
                      {offer.durationMinutes} min
                    </div>
                  )}
                </div>
              </div>
              {offer.modalities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {offer.modalities.map((m) => {
                    const modality = MODALITY_LABELS[m];
                    if (!modality) return null;
                    const Icon = modality.icon;
                    return (
                      <span
                        key={m}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#E9E7E3] px-3 py-1 text-[12.5px] font-medium text-[#4B4842]"
                      >
                        <Icon className="h-3.5 w-3.5 text-[#0F766E]" />
                        {modality.label}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Contact */}
        {profile.contact && (
          <Section title="Contact">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {profile.contact.phone && (
                <ContactRow icon={Phone} label="Téléphone" value={profile.contact.phone} />
              )}
              {profile.contact.whatsapp && (
                <ContactRow icon={MessageCircle} label="WhatsApp" value={profile.contact.whatsapp} />
              )}
              {profile.contact.publicEmail && (
                <ContactRow icon={Mail} label="Email" value={profile.contact.publicEmail} />
              )}
              {profile.contact.website && (
                <ContactRow icon={Globe} label="Site web" value={profile.contact.website} />
              )}
              {profile.contact.linkedInUrl && (
                <ContactRow icon={Linkedin} label="LinkedIn" value={profile.contact.linkedInUrl} />
              )}
            </div>
          </Section>
        )}

        {/* Cabinet */}
        {profile.office && (profile.office.name || profile.office.address) && (
          <Section title="Cabinet">
            <div className="flex flex-col gap-2">
              {profile.office.name && (
                <span className="text-[14.5px] font-bold text-[#1C1B1A]">{profile.office.name}</span>
              )}
              {profile.office.address && (
                <span className="flex items-center gap-1.5 text-[13.5px] text-[#6B6862]">
                  <MapPin className="h-4 w-4 text-[#9A968E]" />
                  {profile.office.address}
                  {profile.cityName && `, ${profile.cityName}`}
                </span>
              )}
            </div>
          </Section>
        )}

        {/* Parcours — Education + Experience */}
        {(profile.education.length > 0 || profile.experience.length > 0) && (
          <Section title="Parcours">
            <div className="flex flex-col gap-5">
              {profile.experience.length > 0 && (
                <div className="flex flex-col gap-3">
                  {profile.experience.map((exp) => (
                    <div key={exp.id} className="flex gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[#E6F2F0]">
                        <Briefcase className="h-4 w-4 text-[#0F766E]" />
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[14px] font-bold text-[#1C1B1A]">
                          {exp.position}
                          {exp.organization && ` — ${exp.organization}`}
                        </span>
                        <span className="text-[12.5px] text-[#9A968E]">
                          {exp.startYear}
                          {exp.endYear ? ` – ${exp.endYear}` : exp.current ? " – présent" : ""}
                        </span>
                        {exp.description && (
                          <p className="text-[13px] text-[#6B6862] mt-1">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {profile.education.length > 0 && (
                <div className="flex flex-col gap-3">
                  {profile.education.map((edu) => (
                    <div key={edu.id} className="flex gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[#E6F2F0]">
                        <GraduationCap className="h-4 w-4 text-[#0F766E]" />
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[14px] font-bold text-[#1C1B1A]">
                          {edu.degree}
                          {edu.institution && ` — ${edu.institution}`}
                        </span>
                        <span className="text-[12.5px] text-[#9A968E]">
                          {edu.startYear}
                          {edu.endYear ? ` – ${edu.endYear}` : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Certifications + Memberships */}
        {(profile.certifications.length > 0 || profile.memberships.length > 0) && (
          <Section title="Certifications & affiliations">
            <div className="flex flex-col gap-4">
              {profile.certifications.length > 0 && (
                <div className="flex flex-col gap-2">
                  {profile.certifications.map((cert) => (
                    <div key={cert.id} className="flex gap-3">
                      <Award className="h-4 w-4 shrink-0 text-[#0F766E] mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-[13.5px] font-medium text-[#1C1B1A]">
                          {cert.title}
                          {cert.issuer && ` — ${cert.issuer}`}
                        </span>
                        {cert.issueYear && (
                          <span className="text-[12px] text-[#9A968E]">{cert.issueYear}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {profile.memberships.length > 0 && (
                <div className="flex flex-col gap-2">
                  {profile.memberships.map((m) => (
                    <div key={m.id} className="flex gap-3">
                      <Users className="h-4 w-4 shrink-0 text-[#0F766E] mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-[13.5px] font-medium text-[#1C1B1A]">
                          {m.organization}
                          {m.role && ` — ${m.role}`}
                        </span>
                        {m.startYear && (
                          <span className="text-[12px] text-[#9A968E]">
                            {m.startYear}
                            {m.endYear ? ` – ${m.endYear}` : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

function PublicHeader() {
  return (
    <header className="flex items-center justify-between bg-white px-10 py-[15px] border-b border-[#E9E7E3]">
      <Link to="/">
        <ChaweerLogo size="sm" showArabic={false} />
      </Link>
    </header>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[16px] bg-white border border-[#E9E7E3] p-6 shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)]">
      <h2 className="text-[16px] font-bold text-[#1C1B1A] mb-4">{title}</h2>
      {children}
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[12px] bg-[#F7F7F5] px-4 py-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-white">
        <Icon className="h-4 w-4 text-[#0F766E]" />
      </span>
      <div className="flex flex-col">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[#9A968E]">
          {label}
        </span>
        <span className="text-[13.5px] font-medium text-[#1C1B1A]">{value}</span>
      </div>
    </div>
  );
}
