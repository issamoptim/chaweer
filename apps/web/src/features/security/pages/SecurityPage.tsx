import { useAuth } from "@/features/auth";
import { AppHeader } from "@/components/AppHeader";
import { AccountCard } from "../components/AccountCard";
import { PasswordCard } from "../components/PasswordCard";
import { GooglePasswordNotice } from "../components/GooglePasswordNotice";
import { SecurityDangerZone } from "../components/SecurityDangerZone";
import { SecuritySkeleton } from "../components/SecuritySkeleton";

export function SecurityPage() {
  const { user, accessToken } = useAuth();

  if (!user || !accessToken) {
    return <SecuritySkeleton />;
  }

  const isGoogle = user.authProvider === "GOOGLE";

  return (
    <div className="min-h-screen bg-white">
      <AppHeader />
      <div className="mx-auto max-w-[760px] px-6 py-10 flex flex-col gap-[22px]">
        <div>
          <h1 className="text-[28px] font-bold tracking-[-0.02em] leading-[1.15] text-foreground">
            Sécurité
          </h1>
          <p className="mt-1 text-[15px] text-[#6B6862]">
            Gérez les accès et la protection de votre compte.
          </p>
        </div>
        <AccountCard email={user.email} authProvider={user.authProvider} />
        {isGoogle ? <GooglePasswordNotice /> : <PasswordCard />}
        <SecurityDangerZone />
      </div>
    </div>
  );
}
