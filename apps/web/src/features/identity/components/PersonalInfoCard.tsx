import { useNavigate } from "react-router-dom";
import { InfoRow } from "./InfoRow";
import type { ProfileData } from "../types/identity-types";

interface PersonalInfoCardProps {
  profile: ProfileData;
}

export function PersonalInfoCard({ profile }: PersonalInfoCardProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-[16px] border border-[#E9E7E3] bg-card p-7 shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[17px] font-bold text-foreground">Informations personnelles</h3>
        <button
          type="button"
          onClick={() => navigate("/mon-compte/modifier")}
          className="text-[14.5px] font-semibold text-foreground transition-colors hover:text-[#0F766E]"
        >
          Modifier mon profil
        </button>
      </div>
      <dl className="divide-y divide-[#F0EEEA]">
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
