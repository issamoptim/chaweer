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
    <div className="flex items-center gap-4 rounded-[16px] border border-[#E9E7E3] bg-card p-7 shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)]">
      <div
        className={cn(
          "flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#0F766E] text-[22px] font-bold text-white",
        )}
        aria-label={`Avatar: ${initials}`}
      >
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-[19px] font-bold text-foreground">
          {profile.firstName} {profile.lastName}
        </h2>
        <p className="text-[14px] text-[#6B6862]">{accountTypeLabel}</p>
        <p className="truncate text-[14px] text-[#6B6862]">{profile.email}</p>
      </div>
    </div>
  );
}
