import { cn } from "@/lib/utils";
import { getInitials } from "../utils/get-initials";
import type { ProfileData } from "../types/identity-types";

interface ProfileSummaryCardProps {
  profile: ProfileData;
}

export function ProfileSummaryCard({ profile }: ProfileSummaryCardProps) {
  const initials = getInitials(profile.firstName, profile.lastName);
  const accountTypeLabel =
    profile.role === "CLIENT"
      ? "Compte Grand Public"
      : profile.role === "PROFESSIONAL"
        ? "Compte Professionnel"
        : "Compte Administrateur";

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-6">
      <div
        className={cn(
          "flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground",
        )}
        aria-label={`Avatar: ${initials}`}
      >
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-lg font-semibold text-foreground">
          {profile.firstName} {profile.lastName}
        </h2>
        <p className="text-sm text-muted-foreground">{accountTypeLabel}</p>
        <p className="truncate text-sm text-muted-foreground">{profile.email}</p>
      </div>
    </div>
  );
}
