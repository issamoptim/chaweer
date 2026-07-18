import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "@/features/auth";
import { InfoRow } from "./InfoRow";
import type { ProfileData } from "../types/identity-types";

interface PersonalInfoCardProps {
  profile: ProfileData;
}

export function PersonalInfoCard({ profile }: PersonalInfoCardProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">Informations personnelles</h3>
        <PrimaryButton
          type="button"
          onClick={() => navigate("/mon-compte/modifier")}
          className="w-auto px-4 py-2"
        >
          Modifier mon profil
        </PrimaryButton>
      </div>
      <dl className="divide-y divide-border">
        <InfoRow label="Prénom" value={profile.firstName} />
        <InfoRow label="Nom" value={profile.lastName} />
        <InfoRow label="Email" value={profile.email} />
        <InfoRow label="Téléphone" value={profile.phone} />
        <InfoRow label="Pays" value={profile.country} fallback="Maroc" />
        <InfoRow label="Ville" value={profile.city} />
        <InfoRow label="Nationalité" value={profile.nationality} />
      </dl>
    </div>
  );
}
