import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth, authService, LoadingSpinner } from "@/features/auth";
import { AccountCard } from "@/features/security/components/AccountCard";
import { PasswordCard } from "@/features/security/components/PasswordCard";
import { GooglePasswordNotice } from "@/features/security/components/GooglePasswordNotice";
import { SecurityDangerZone } from "@/features/security/components/SecurityDangerZone";

export function ProfessionalSecurityPage() {
  const { user, accessToken, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await authService.logout();
    } catch {
      // ignore API errors — still clear local state
    } finally {
      logout();
      navigate("/connexion", { replace: true });
    }
  }

  if (!user || !accessToken) {
    return (
      <div className="flex flex-col gap-[22px] animate-pulse" aria-label="Chargement de la sécurité">
        <div className="h-[28px] w-40 rounded-[8px] bg-[#E7E5E1]" />
        <div className="h-[20px] w-72 rounded bg-[#E7E5E1]" />
        <div className="rounded-[16px] border border-[#E9E7E3] bg-card p-7 shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)] space-y-3">
          <div className="h-5 w-24 rounded bg-[#E7E5E1]" />
          <div className="h-12 w-full rounded-[12px] bg-[#E7E5E1]" />
          <div className="h-12 w-full rounded-[12px] bg-[#E7E5E1]" />
        </div>
        <div className="rounded-[16px] border border-[#E9E7E3] bg-card p-7 shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)] space-y-3">
          <div className="h-5 w-32 rounded bg-[#E7E5E1]" />
          <div className="h-12 w-full rounded-[12px] bg-[#E7E5E1]" />
          <div className="h-12 w-full rounded-[12px] bg-[#E7E5E1]" />
          <div className="h-12 w-full rounded-[12px] bg-[#E7E5E1]" />
        </div>
        <div className="rounded-[16px] border border-[#F3D9D7] bg-[#FDF3F2] p-7 space-y-3">
          <div className="h-5 w-36 rounded bg-[#E9C9C7]" />
          <div className="h-4 w-full rounded bg-[#E9C9C7]" />
          <div className="h-11 w-44 rounded-[11px] bg-[#E9C9C7]" />
        </div>
      </div>
    );
  }

  const isGoogle = user.authProvider === "GOOGLE";

  return (
    <div className="flex flex-col gap-[22px]">
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

      <section
        aria-labelledby="logout-card-title"
        className="rounded-[16px] border border-[#E9E7E3] bg-card p-7 shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)]"
      >
        <h3 id="logout-card-title" className="mb-2 text-[17px] font-bold text-foreground">
          Déconnexion
        </h3>
        <p className="mb-4 text-[14px] text-[#6B6862]">
          Mettez fin à votre session en cours sur cet appareil.
        </p>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="inline-flex h-[44px] items-center gap-2 rounded-[11px] border border-[#E9E7E3] bg-white px-4 text-[14px] font-medium text-[#4B4842] transition-colors hover:bg-[#F7F7F5] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(20,184,166,0.40)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoggingOut ? (
            <LoadingSpinner size="sm" />
          ) : (
            <LogOut className="h-4 w-4" aria-hidden="true" />
          )}
          {isLoggingOut ? "Déconnexion…" : "Se déconnecter"}
        </button>
      </section>

      <SecurityDangerZone />
    </div>
  );
}
