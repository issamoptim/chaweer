import { ReadOnlyField } from "@/features/identity/components/ReadOnlyField";

interface AccountCardProps {
  email: string;
  authProvider: string;
}

export function AccountCard({ email, authProvider }: AccountCardProps) {
  const isGoogle = authProvider === "GOOGLE";
  const providerLabel = isGoogle ? "Google" : "E-mail et mot de passe";
  const badgeBg = isGoogle ? "bg-[#E6F2F0]" : "bg-[#F2F1EF]";
  const badgeText = isGoogle ? "text-[#0F766E]" : "text-[#6B6862]";

  return (
    <section
      aria-labelledby="account-card-title"
      className="rounded-[16px] border border-[#E9E7E3] bg-card p-7 shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)]"
    >
      <h3 id="account-card-title" className="mb-4 text-[17px] font-bold text-foreground">
        Compte
      </h3>
      <div className="flex flex-col gap-[18px]">
        <ReadOnlyField label="Adresse e-mail" value={email} />
        <div className="flex flex-col">
          <label className="flex items-center gap-[6px] text-[13.5px] font-semibold text-[#6B6862] mb-[7px]">
            Méthode de connexion
          </label>
          <div className="flex min-h-[50px] items-center gap-2 rounded-[12px] border-[1.5px] border-[#EAE8E3] bg-[#F2F1EF] px-[15px] py-[14px]">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-[13px] font-semibold ${badgeBg} ${badgeText}`}
            >
              {providerLabel}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
