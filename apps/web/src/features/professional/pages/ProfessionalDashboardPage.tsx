import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Scale,
  Video,
  MapPin,
  Eye,
  EyeOff,
  Check,
  ChevronRight,
  TrendingUp,
  CalendarCheck,
  Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PUBLICATION_REQUIREMENTS, type PublicationRequirement } from "@chaweer/shared";
import { useToast } from "@/hooks/useToast";
import { useProfessionalProfile } from "../hooks/useProfessionalProfile";
import { usePublishProfile } from "../hooks/usePublishProfile";
import { useUnpublishProfile } from "../hooks/useUnpublishProfile";
import { evaluatePublicationReadiness } from "../utils/publication-readiness";
import { Card } from "../components/Card";
import { StatusPill } from "../components/StatusPill";

const REQUIREMENT_TO_ROUTE: Record<PublicationRequirement, string> = {
  firstName: "/pro/profil",
  lastName: "/pro/profil",
  barAssociation: "/pro/profil",
  biography: "/pro/profil",
  specialization: "/pro/expertise",
  offerTitle: "/pro/offre",
  offerDescription: "/pro/offre",
  offerPrice: "/pro/offre",
  offerModality: "/pro/offre",
};

const REQUIREMENT_LABELS_DASHBOARD: Record<PublicationRequirement, string> = {
  firstName: "Prénom",
  lastName: "Nom",
  barAssociation: "Barreau",
  biography: "Biographie",
  specialization: "Situation d'expertise",
  offerTitle: "Titre de l'offre",
  offerDescription: "Description de l'offre",
  offerPrice: "Prix de l'offre",
  offerModality: "Modalité de consultation",
};

interface ManageRow {
  icon: LucideIcon;
  title: string;
  hint: string;
  to: string;
  done: boolean;
}

const STAT_TILES: { icon: LucideIcon; label: string }[] = [
  { icon: Eye, label: "Vues du profil" },
  { icon: TrendingUp, label: "Demandes de rendez-vous" },
  { icon: CalendarCheck, label: "Consultations réalisées" },
  { icon: Star, label: "Note moyenne" },
];

export function ProfessionalDashboardPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { data: profile, isLoading } = useProfessionalProfile();
  const publishMutation = usePublishProfile();
  const unpublishMutation = useUnpublishProfile();
  const [showUnpublishDialog, setShowUnpublishDialog] = useState(false);

  const readiness = evaluatePublicationReadiness(profile);
  const isPublished = profile?.status === "PUBLISHED";
  const isUnpublished = profile?.status === "DRAFT" && !!profile?.unpublishedAt;
  const isIncomplete = !isPublished && !isUnpublished;
  const missingItems = readiness.checklist.filter((c) => !c.done);

  const firstName = profile?.identity.firstName ?? "";

  const manageRows: ManageRow[] = [
    {
      icon: UserRound,
      title: "Profil",
      hint: "Qui vous êtes, tel que le public vous voit",
      to: "/pro/profil",
      done:
        !!profile?.identity.firstName &&
        !!profile?.identity.lastName &&
        !!profile?.identity.barAssociationId &&
        !!profile?.biography.bio &&
        profile.biography.bio.trim().length >= 200,
    },
    {
      icon: Scale,
      title: "Expertise",
      hint: "Pour être proposé aux bons clients, au bon moment",
      to: "/pro/expertise",
      done: (profile?.expertise.specializationIds.length ?? 0) > 0,
    },
    {
      icon: Video,
      title: "Consultation",
      hint: "Ce que vous proposez et à quel tarif",
      to: "/pro/offre",
      done:
        readiness.checklist.find((c) => c.key === PUBLICATION_REQUIREMENTS.OFFER_TITLE)?.done === true &&
        readiness.checklist.find((c) => c.key === PUBLICATION_REQUIREMENTS.OFFER_PRICE)?.done === true &&
        readiness.checklist.find((c) => c.key === PUBLICATION_REQUIREMENTS.OFFER_MODALITY)?.done === true,
    },
    {
      icon: MapPin,
      title: "Contact & cabinet",
      hint: "Comment vous joindre et où vous trouver",
      to: "/pro/contact",
      done:
        (!!profile?.contact?.phone && profile.contact.phone.trim() !== "") ||
        (!!profile?.contact?.whatsapp && profile.contact.whatsapp.trim() !== "") ||
        (!!profile?.contact?.publicEmail && profile.contact.publicEmail.trim() !== "") ||
        (!!profile?.contact?.website && profile.contact.website.trim() !== "") ||
        (!!profile?.contact?.linkedInUrl && profile.contact.linkedInUrl.trim() !== "") ||
        (!!profile?.office?.name && profile.office.name.trim() !== "") ||
        (!!profile?.office?.address && profile.office.address.trim() !== "") ||
        (!!profile?.office?.cityId && profile.office.cityId.trim() !== ""),
    },
  ];

  function handlePublish() {
    publishMutation.mutate(undefined, {
      onSuccess: () => toast.showSuccess("Profil publié avec succès."),
      onError: () => toast.showError("Impossible de publier votre profil."),
    });
  }

  function handleUnpublish() {
    unpublishMutation.mutate(undefined, {
      onSuccess: () => {
        toast.showSuccess("Profil masqué.");
        setShowUnpublishDialog(false);
      },
      onError: () => toast.showError("Impossible de masquer votre profil."),
    });
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <div className="h-32 w-full animate-pulse rounded-[20px] bg-[#E9E7E3]" />
        <div className="h-40 w-full animate-pulse rounded-[16px] bg-[#E9E7E3]" />
        <div className="h-48 w-full animate-pulse rounded-[16px] bg-[#E9E7E3]" />
      </div>
    );
  }

  const isPublishing = publishMutation.isPending || unpublishMutation.isPending;

  return (
    <div className="flex flex-col gap-5">
      {/* Bandeau héro */}
      <div
        className="relative overflow-hidden rounded-[20px] p-[30px]"
        style={{ background: "linear-gradient(118deg, #0F766E 0%, #134E4A 85%)" }}
      >
        <div
          className="absolute -right-16 -top-16 h-48 w-48 rounded-full"
          style={{ background: "rgba(255,255,255,0.07)" }}
        />
        <div
          className="absolute -bottom-20 -right-8 h-40 w-40 rounded-full"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-3">
            <h1 className="text-[24px] font-extrabold text-white">
              Bonjour {firstName || "à vous"}
            </h1>
            <p className="text-[14.5px]" style={{ color: "rgba(255,255,255,0.75)" }}>
              Voici l'état de votre présence sur Chaweer.
            </p>

            {isPublished && (
              <span
                className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[12.5px] font-semibold text-white"
                style={{ background: "rgba(255,255,255,0.14)" }}
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#14B8A6]">
                  <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                </span>
                Profil consultable par le public
              </span>
            )}
            {isUnpublished && (
              <span
                className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[12.5px] font-semibold text-white"
                style={{ background: "rgba(255,255,255,0.14)" }}
              >
                <EyeOff className="h-3.5 w-3.5" />
                Profil masqué — invisible au public
              </span>
            )}

            {isIncomplete && missingItems.length > 0 && (
              <div
                className="mt-2 rounded-[14px] p-4"
                style={{ background: "rgba(255,255,255,0.10)" }}
              >
                <p className="text-[13.5px] font-medium text-white">
                  Pour rendre votre profil consultable par le public, il manque :
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {missingItems.map((item) => (
                    <li key={item.key}>
                      <button
                        type="button"
                        onClick={() => navigate(REQUIREMENT_TO_ROUTE[item.key])}
                        className="flex w-full items-center justify-between rounded-[10px] bg-white px-3 py-2 text-left text-[13px] font-medium text-[#1C1B1A] transition-colors hover:bg-[#F0FAF8]"
                      >
                        {REQUIREMENT_LABELS_DASHBOARD[item.key]}
                        <span className="flex items-center gap-1 text-[12px] font-semibold text-[#0F766E]">
                          Compléter
                          <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex shrink-0 flex-col gap-2.5">
            <button
              type="button"
              onClick={() => navigate(`/avocat/${profile?.id}`)}
              className="flex h-[42px] items-center justify-center gap-2 rounded-[10px] bg-white px-4 text-[13.5px] font-semibold text-[#0F766E] shadow-sm transition-colors hover:bg-[#F0FAF8]"
            >
              <Eye className="h-4 w-4" />
              Vue client
            </button>

            {isPublished && (
              <button
                type="button"
                onClick={() => setShowUnpublishDialog(true)}
                disabled={isPublishing}
                className="flex h-[42px] items-center justify-center gap-2 rounded-[10px] border px-4 text-[13.5px] font-semibold text-white transition-colors hover:bg-white/10 disabled:opacity-50"
                style={{ borderColor: "rgba(255,255,255,0.45)" }}
              >
                <EyeOff className="h-4 w-4" />
                Dépublier
              </button>
            )}

            {isUnpublished && readiness.isReady && (
              <button
                type="button"
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex h-[42px] items-center justify-center gap-2 rounded-[10px] px-4 text-[13.5px] font-semibold text-[#0B3B37] transition-colors hover:opacity-90 disabled:opacity-50"
                style={{ background: "#14B8A6" }}
              >
                Publier mon profil
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Carte Statistiques (Bientôt) */}
      <Card title="Statistiques">
        <div className="mb-4">
          <StatusPill variant="soon" />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {STAT_TILES.map((tile) => {
            const Icon = tile.icon;
            return (
              <div
                key={tile.label}
                className="flex flex-col gap-2 rounded-[12px] bg-[#F7F7F5] p-3.5"
              >
                <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] bg-white">
                  <Icon className="h-4 w-4 text-[#0F766E]" />
                </span>
                <span className="text-[12px] font-semibold text-[#6B6862]">{tile.label}</span>
                <span className="text-[21px] font-extrabold text-[#CFCBC3]">—</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Carte Gérer mon profil */}
      <Card title="Gérer mon profil">
        <p className="mb-4 text-[13.5px] text-[#6B6862]">
          Plus votre profil est complet, plus vous êtes visible par les bons clients.
        </p>
        <div className="flex flex-col gap-1">
          {manageRows.map((row) => {
            const Icon = row.icon;
            return (
              <button
                key={row.title}
                type="button"
                onClick={() => navigate(row.to)}
                className="flex items-center gap-3 rounded-[12px] p-3 text-left transition-colors hover:bg-[#F7F7F5]"
              >
                <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-[#E6F2F0] text-[#0F766E]">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="text-[14.5px] font-bold text-[#1C1B1A]">{row.title}</span>
                  <span className="text-[12.5px] text-[#9A968E]">{row.hint}</span>
                </div>
                <StatusPill variant={row.done ? "complete" : "incomplete"} />
                <ChevronRight className="h-5 w-5 shrink-0 text-[#B4AFA6]" />
              </button>
            );
          })}
        </div>
      </Card>

      {/* Dialog de confirmation Dépublier */}
      {showUnpublishDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={() => setShowUnpublishDialog(false)}
        >
          <div
            className="mx-4 w-full max-w-[400px] rounded-[16px] bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-[18px] font-bold text-[#1C1B1A]">Dépublier votre profil</h2>
            <p className="mt-2 text-[14px] text-[#6B6862]">
              Votre profil ne sera plus visible par le public. Vous pourrez le republier à tout
              moment.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowUnpublishDialog(false)}
                className="flex h-[42px] items-center rounded-[10px] border-[1.5px] border-[#E7E5E1] bg-white px-5 text-[14px] font-semibold text-[#4B4842] transition-colors hover:bg-[#F0EEEA]"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleUnpublish}
                disabled={isPublishing}
                className="flex h-[42px] items-center rounded-[10px] bg-[#0F766E] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#134E4A] disabled:opacity-50"
              >
                Dépublier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
