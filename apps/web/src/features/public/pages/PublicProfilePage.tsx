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
  Scale,
  Languages,
  Pencil,
  BadgeCheck,
  Calendar,
  LayoutGrid,
} from "lucide-react";
import { usePublicProfile } from "../hooks/usePublicProfile";
import { resolveMediaUrl } from "@/utils/media-url";
import { ChaweerLogo } from "@/components/ChaweerLogo";
import { useProfessionalProfile } from "@/features/professional/hooks/useProfessionalProfile";
import { useAuth } from "@/features/auth";

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
  const { user } = useAuth();
  const isPro = user?.role === "PROFESSIONAL";
  const isOwner = !!profile && !!myProfile && profile.id === myProfile.id;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F7F5]">
        <PublicHeader isPro={isPro} />
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6 py-8 sm:py-10 flex flex-col gap-5 sm:gap-6">
          <div className="h-3 w-20 animate-pulse rounded bg-[#E9E7E3]" />
          <div className="h-44 w-full animate-pulse rounded-[18px] sm:rounded-[20px] bg-[#E9E7E3]" />
          <div className="h-28 w-full animate-pulse rounded-[16px] bg-[#E9E7E3]" />
          <div className="h-44 w-full animate-pulse rounded-[16px] bg-[#E9E7E3]" />
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-screen bg-[#F7F7F5]">
        <PublicHeader isPro={isPro} />
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6 py-16 sm:py-20 flex flex-col items-center text-center">
          <Scale className="h-12 w-12 text-[#B4AFA6]" />
          <h1 className="mt-4 text-[20px] sm:text-[22px] font-bold text-[#1C1B1A]">
            Profil introuvable
          </h1>
          <p className="mt-2 text-[14px] sm:text-[14.5px] text-[#6B6862] max-w-[320px]">
            Ce profil n'est pas disponible ou n'est plus publié.
          </p>
          <Link
            to={isPro ? "/pro/tableau-de-bord" : "/"}
            className="mt-6 flex h-[44px] items-center rounded-[12px] bg-[#0F766E] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#134E4A]"
          >
            {isPro ? "Retour à mon espace" : "Retour à l'accueil"}
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
      <PublicHeader isPro={isPro} />

      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-6">
          {/* Main content */}
          <div className="flex-1 flex flex-col gap-5 sm:gap-6 min-w-0 max-w-[840px] mx-auto lg:mx-0 w-full">
            <Link
              to={isPro ? "/pro/tableau-de-bord" : "/"}
              className="inline-flex items-center gap-[7px] text-[13.5px] font-semibold text-[#0F766E] transition-colors hover:underline w-fit"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
              {isPro ? "Mon espace" : "Retour"}
            </Link>

        {/* Hero card — identity + photo */}
        <div className="rounded-[18px] sm:rounded-[20px] bg-white border border-[#E9E7E3] p-5 sm:p-7 shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            {profile.identity.photoUrl ? (
              <img
                src={resolveMediaUrl(profile.identity.photoUrl) ?? undefined}
                alt={fullName}
                className="h-[88px] w-[88px] sm:h-[96px] sm:w-[96px] rounded-full object-cover shrink-0 ring-2 ring-[#E6F2F0]"
              />
            ) : (
              <span className="flex h-[88px] w-[88px] sm:h-[96px] sm:w-[96px] shrink-0 items-center justify-center rounded-full bg-[#0F766E] text-[28px] sm:text-[32px] font-bold text-white">
                {initials}
              </span>
            )}

            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <h1 className="text-[22px] sm:text-[26px] font-extrabold tracking-[-0.02em] text-[#1C1B1A] leading-tight">
                {fullName}
              </h1>
              {profile.identity.professionalTitle && (
                <p className="text-[14px] sm:text-[15px] font-medium text-[#0F766E]">
                  {profile.identity.professionalTitle}
                </p>
              )}
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-1">
                {profile.barAssociationName && (
                  <span className="inline-flex items-center gap-1.5 text-[12.5px] sm:text-[13px] text-[#6B6862]">
                    <Scale className="h-3.5 w-3.5 shrink-0" />
                    {profile.barAssociationName}
                  </span>
                )}
                {profile.identity.yearsOfExperience != null && (
                  <span className="inline-flex items-center gap-1.5 text-[12.5px] sm:text-[13px] text-[#6B6862]">
                    <Briefcase className="h-3.5 w-3.5 shrink-0" />
                    {profile.identity.yearsOfExperience} ans d'expérience
                  </span>
                )}
                {profile.cityName && (
                  <span className="inline-flex items-center gap-1.5 text-[12.5px] sm:text-[13px] text-[#6B6862]">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {profile.cityName}
                  </span>
                )}
              </div>
            </div>

            {isOwner && (
              <Link
                to="/pro/profil"
                className="shrink-0 flex h-[40px] items-center gap-2 rounded-[10px] border border-[#E7E5E1] bg-white px-4 text-[13px] font-semibold text-[#0F766E] transition-colors hover:bg-[#F0FAF8] w-full sm:w-auto justify-center"
              >
                <Pencil className="h-4 w-4" />
                Modifier mon profil
              </Link>
            )}
          </div>

          {/* Quick info badges */}
          {(profile.identity.registrationNumber || profile.identity.yearsOfExperience != null) && (
            <div className="mt-5 pt-5 border-t border-[#F0EEEA] grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.identity.registrationNumber && (
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-[#0F766E] shrink-0" />
                  <span className="text-[12.5px] text-[#9A968E]">N° d'inscription</span>
                  <span className="text-[13px] font-semibold text-[#1C1B1A]">
                    {profile.identity.registrationNumber}
                  </span>
                </div>
              )}
              {profile.identity.yearsOfExperience != null && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#0F766E] shrink-0" />
                  <span className="text-[12.5px] text-[#9A968E]">Expérience</span>
                  <span className="text-[13px] font-semibold text-[#1C1B1A]">
                    {profile.identity.yearsOfExperience} ans
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Biographie */}
        {profile.biography.bio && profile.biography.bio.trim() && (
          <Section title="À propos">
            <p className="text-[14px] sm:text-[14.5px] leading-[1.7] text-[#4B4842] whitespace-pre-line">
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
                        className="rounded-full bg-[#E6F2F0] border border-[#CDE5E1] px-3 py-1 text-[12.5px] font-medium text-[#0F766E]"
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
                    Situations traitées
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
          <Section title="Langues de consultation">
            <div className="flex items-center gap-2 flex-wrap">
              <Languages className="h-4 w-4 text-[#9A968E] shrink-0" />
              {profile.languageNames.map((name, i) => (
                <span key={name} className="inline-flex items-center gap-2">
                  {i > 0 && <span className="text-[#B4AFA6]">·</span>}
                  <span className="text-[13.5px] font-medium text-[#4B4842]">{name}</span>
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Contact */}
        {profile.contact && (
          profile.contact.phone ||
          profile.contact.whatsapp ||
          profile.contact.publicEmail ||
          profile.contact.website ||
          profile.contact.linkedInUrl
        ) && (
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
            <div className="flex flex-col gap-3">
              {profile.office.name && (
                <span className="text-[14.5px] font-bold text-[#1C1B1A]">{profile.office.name}</span>
              )}
              {profile.office.address && (
                <span className="flex items-start gap-1.5 text-[13.5px] text-[#6B6862]">
                  <MapPin className="h-4 w-4 text-[#9A968E] shrink-0 mt-0.5" />
                  <span>
                    {profile.office.address}
                    {profile.cityName && `, ${profile.cityName}`}
                  </span>
                </span>
              )}
              {profile.office.latitude != null && profile.office.longitude != null && (
                <div className="mt-1 overflow-hidden rounded-[12px] border border-[#E9E7E3]">
                  <iframe
                    title="Localisation du cabinet"
                    width="100%"
                    height="200"
                    loading="lazy"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps?q=${profile.office.latitude},${profile.office.longitude}&z=15&output=embed`}
                  />
                </div>
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
                      <div className="flex flex-col gap-0.5 min-w-0">
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
                      <div className="flex flex-col gap-0.5 min-w-0">
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

        {/* Certification */}
        {profile.certifications.length > 0 && (
          <Section title="Certification">
            <div className="flex flex-col gap-2">
              {profile.certifications.map((cert) => (
                <div key={cert.id} className="flex gap-3">
                  <Award className="h-4 w-4 shrink-0 text-[#0F766E] mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-[13.5px] font-medium text-[#1C1B1A]">
                      {cert.title}
                      {cert.issuer && ` — ${cert.issuer}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Footer */}
        <div className="pt-2 pb-4 text-center">
          <p className="text-[12px] text-[#B4AFA6]">
            Fiche consultable sur{" "}
            <Link to="/" className="font-semibold text-[#0F766E] hover:underline">
              Chaweer
            </Link>
          </p>
        </div>
          </div>

          {/* Sidebar — sticky on desktop, bottom on mobile */}
          <aside className="w-full lg:w-[320px] shrink-0">
            <div className="lg:sticky lg:top-[80px] flex flex-col gap-4">
              {offer ? (
                <div className="rounded-[16px] bg-white border border-[#E9E7E3] p-5 shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)]">
                  <div className="rounded-[12px] bg-[#F0FAF8] border border-[#B8E4DF] p-4 flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[14px] font-bold text-[#1C1B1A]">{offer.title}</span>
                      {offer.description && (
                        <p className="text-[12.5px] leading-[1.5] text-[#6B6862]">
                          {offer.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className="text-[22px] font-extrabold text-[#0F766E] leading-none">
                          {offer.price} {offer.currency}
                        </span>
                        {offer.durationMinutes > 0 && (
                          <span className="mt-1 flex items-center gap-1 text-[12px] text-[#9A968E]">
                            <Clock className="h-3 w-3" />
                            {offer.durationMinutes} min
                          </span>
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
                              className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#E9E7E3] px-3 py-1.5 text-[12.5px] font-medium text-[#4B4842]"
                            >
                              <Icon className="h-3.5 w-3.5 text-[#0F766E]" />
                              {modality.label}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="mt-4 flex h-[46px] w-full items-center justify-center rounded-[12px] bg-[#0F766E] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#134E4A]"
                  >
                    Consulter maintenant
                  </button>
                </div>
              ) : (
                <div className="rounded-[16px] bg-white border border-[#E9E7E3] p-5 shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)]">
                  <p className="text-[13.5px] text-[#9A968E] text-center">
                    Aucune consultation disponible
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function PublicHeader({ isPro }: { isPro: boolean }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-4 sm:px-10 py-[13px] sm:py-[15px] border-b border-[#E9E7E3]">
      <Link to={isPro ? "/pro/tableau-de-bord" : "/"} className="shrink-0">
        <ChaweerLogo size="sm" showArabic={false} />
      </Link>
      {isPro && (
        <Link
          to="/pro/tableau-de-bord"
          className="flex items-center gap-1.5 text-[13px] sm:text-[14px] font-medium text-[#6B6862] transition-colors hover:text-[#0F766E]"
        >
          <LayoutGrid className="h-4 w-4" />
          <span className="hidden sm:inline">Mon espace</span>
        </Link>
      )}
    </header>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[16px] bg-white border border-[#E9E7E3] p-5 sm:p-6 shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)]">
      <h2 className="text-[15px] sm:text-[16px] font-bold text-[#1C1B1A] mb-4">{title}</h2>
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
      <div className="flex flex-col min-w-0">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[#9A968E]">
          {label}
        </span>
        <span className="text-[13.5px] font-medium text-[#1C1B1A] truncate">{value}</span>
      </div>
    </div>
  );
}
