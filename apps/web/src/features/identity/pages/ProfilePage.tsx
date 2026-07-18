import { useProfile } from "../hooks/useProfile";
import { ErrorMessage, LoadingSpinner } from "@/features/auth";
import { ProfileSummaryCard } from "../components/ProfileSummaryCard";
import { PersonalInfoCard } from "../components/PersonalInfoCard";
import { PreferencesCard } from "../components/PreferencesCard";
import { DangerZone } from "../components/DangerZone";
import { ProfileSkeleton } from "../components/ProfileSkeleton";

export function ProfilePage() {
  const { data: profile, isLoading, isError, refetch } = useProfile();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !profile) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 py-12">
        <ErrorMessage message="Impossible de charger votre profil." />
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <LoadingSpinner size="sm" />
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Mon profil</h1>
      <ProfileSummaryCard profile={profile} />
      <PersonalInfoCard profile={profile} />
      <PreferencesCard profile={profile} />
      <DangerZone />
    </div>
  );
}
