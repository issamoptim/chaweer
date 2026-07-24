import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function LandingHeader() {
  const { t } = useTranslation();

  return (
    <header
      className="sticky top-0 z-30 flex h-[58px] items-center justify-between px-5 backdrop-blur-[12px] sm:px-12"
      style={{
        background: "rgba(255,255,255,.96)",
        borderBottom: "1px solid rgba(0,0,0,.07)",
      }}
    >
      <div
        className="flex-shrink-0 text-[20px] font-extrabold text-primary"
        style={{ letterSpacing: "-0.02em" }}
      >
        Chaweer
      </div>

      <nav className="hidden items-center gap-6 text-sm font-medium text-[#4B4A46] sm:flex">
        <a
          href="#avocats"
          className="transition-colors hover:text-primary"
        >
          {t("landing.header.nav.findLawyer")}
        </a>
        <a
          href="#comment-ca-marche"
          className="transition-colors hover:text-primary"
        >
          {t("landing.header.nav.howItWorks")}
        </a>
        <a
          href="#"
          className="transition-colors hover:text-primary"
        >
          {t("landing.header.nav.forLawyers")}
        </a>
        <a
          href="#"
          className="transition-colors hover:text-primary"
        >
          {t("landing.header.nav.help")}
        </a>
      </nav>

      <div className="flex flex-shrink-0 items-center gap-2.5">
        <LanguageSwitcher />
        <a
          href="#"
          className="rounded-[9px] px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-alt"
        >
          {t("landing.header.login")}
        </a>
        <a
          href="#"
          className="rounded-[9px] bg-primary px-5 py-[9px] text-sm font-bold text-white transition-colors hover:bg-primary-hover"
        >
          {t("landing.header.signup")}
        </a>
      </div>
    </header>
  );
}
