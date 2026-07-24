import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, LayoutDashboard } from "lucide-react";
import { ChaweerLogo } from "@/components/ChaweerLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useAuth, authService } from "@/features/auth";

export function LandingHeader() {
  const { t } = useTranslation();
  const { status, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = status === "authenticated";
  const isProfessional = user?.role === "PROFESSIONAL";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore network errors
    }
    logout();
    navigate("/", { replace: true });
  };

  const handleNavScroll = (hash: string) => {
    if (window.location.pathname === "/") {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${hash}`);
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "";

  return (
    <header
      className="sticky top-0 z-30 flex h-[58px] items-center justify-between px-6 backdrop-blur-[12px] sm:px-8 lg:px-10"
      style={{
        background: "rgba(255,255,255,.96)",
        borderBottom: "1px solid rgba(0,0,0,.07)",
      }}
    >
      <Link
        to="/"
        className="flex flex-shrink-0 items-center no-underline"
        aria-label="Chaweer - Accueil"
      >
        <ChaweerLogo size="sm" showArabic={false} />
      </Link>

      <nav className="hidden items-center gap-6 text-sm font-medium text-[#4B4A46] sm:flex">
        <button
          onClick={() => handleNavScroll("avocats")}
          className="transition-colors hover:text-primary"
        >
          {t("landing.header.nav.findLawyer")}
        </button>
        <button
          onClick={() => handleNavScroll("comment-ca-marche")}
          className="transition-colors hover:text-primary"
        >
          {t("landing.header.nav.howItWorks")}
        </button>
        {!isAuthenticated && (
          <Link
            to="/pro/inscription"
            className="transition-colors hover:text-primary"
          >
            {t("landing.header.nav.forLawyers")}
          </Link>
        )}
        <a
          href="#"
          className="transition-colors hover:text-primary"
        >
          {t("landing.header.nav.help")}
        </a>
      </nav>

      <div className="flex flex-shrink-0 items-center gap-2.5">
        <LanguageSwitcher />
        {isAuthenticated && user ? (
          <>
            {isProfessional && (
              <Link
                to="/pro/tableau-de-bord"
                className="hidden items-center gap-1.5 rounded-[9px] px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-surface-alt sm:flex"
              >
                <LayoutDashboard className="h-4 w-4" />
                Tableau de bord
              </Link>
            )}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-[9px] px-2 py-1.5 transition-colors hover:bg-surface-alt"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {initials}
                  </span>
                )}
                <span className="hidden text-sm font-medium text-foreground sm:inline">
                  {user.firstName}
                </span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-56 overflow-hidden rounded-xl border border-border bg-white py-1 shadow-lg">
                  <Link
                    to={isProfessional ? "/pro/profil" : "/mon-compte"}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-surface-alt"
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    Mon profil
                  </Link>
                  {isProfessional && (
                    <Link
                      to="/pro/tableau-de-bord"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-surface-alt sm:hidden"
                    >
                      <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                      Tableau de bord
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-surface-alt"
                  >
                    <LogOut className="h-4 w-4 text-muted-foreground" />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link
              to="/connexion"
              className="rounded-[9px] px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-alt"
            >
              {t("landing.header.login")}
            </Link>
            <Link
              to="/inscription"
              className="rounded-[9px] bg-primary px-5 py-[9px] text-sm font-bold text-white transition-colors hover:bg-primary-hover"
            >
              {t("landing.header.signup")}
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
