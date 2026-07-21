import { useNavigate } from "react-router-dom";
import { Shield, Briefcase } from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import { ErrorMessage, LoadingSpinner } from "@/features/auth";
import { AppHeader } from "@/components/AppHeader";
import { ProfileSummaryCard } from "../components/ProfileSummaryCard";
import { PersonalInfoCard } from "../components/PersonalInfoCard";
import { PreferencesCard } from "../components/PreferencesCard";
import { ProfileSkeleton } from "../components/ProfileSkeleton";

export function ProfilePage() {
  const { data: profile, isLoading, isError, refetch } = useProfile();
  const navigate = useNavigate();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !profile) {
    return (
      <div className="min-h-screen bg-white">
        <AppHeader />
        <div className="mx-auto max-w-[760px] px-6 py-10 flex flex-col gap-[22px]">
          <h1 className="text-[28px] font-bold tracking-[-0.02em] leading-[1.15] text-foreground">Mon profil</h1>
          <ErrorMessage message="Impossible de charger votre profil." />
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex h-[50px] w-auto items-center gap-2 rounded-[12px] border-[1.5px] border-[#E7E5E1] bg-card px-4 text-[15px] font-semibold text-foreground transition-colors hover:bg-[#F7F7F5]"
          >
            <LoadingSpinner size="sm" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AppHeader />
      <div className="mx-auto max-w-[760px] px-6 py-10 flex flex-col gap-[22px]">
        <h1 className="text-[28px] font-bold tracking-[-0.02em] leading-[1.15] text-foreground">Mon profil</h1>
        <ProfileSummaryCard profile={profile} />
        <PersonalInfoCard profile={profile} />
        <PreferencesCard profile={profile} />
        {profile.role === "PROFESSIONAL" && (
          <button
            type="button"
            onClick={() => navigate("/pro/profil")}
            className="flex items-center justify-between rounded-[16px] border border-[#E9E7E3] bg-card p-7 shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)] transition-colors hover:bg-[#F7F7F5] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(20,184,166,0.40)]"
          >
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-[#0F766E]" aria-hidden="true" />
              <div className="text-left">
                <p className="text-[15px] font-semibold text-foreground">Profil professionnel</p>
                <p className="text-[13px] text-[#6B6862]">
                  Photo, barreau, téléphone professionnel, cabinet, biographie
                </p>
              </div>
            </div>
            <span className="text-[14px] font-semibold text-[#0F766E]">Gérer</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => navigate("/mon-compte/securite")}
          className="flex items-center justify-between rounded-[16px] border border-[#E9E7E3] bg-card p-7 shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)] transition-colors hover:bg-[#F7F7F5] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(20,184,166,0.40)]"
        >
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-[#0F766E]" aria-hidden="true" />
            <div className="text-left">
              <p className="text-[15px] font-semibold text-foreground">Sécurité du compte</p>
              <p className="text-[13px] text-[#6B6862]">
                Mot de passe, méthode de connexion, suppression du compte
              </p>
            </div>
          </div>
          <span className="text-[14px] font-semibold text-[#0F766E]">Gérer</span>
        </button>
      </div>
    </div>
  );
}
