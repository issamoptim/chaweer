import { useTranslation } from "react-i18next";

export function LandingFooter() {
  const { t } = useTranslation();

  return (
    <footer
      className="px-5 pb-7 pt-10 sm:px-12"
      style={{ background: "#0C3D38" }}
    >
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-5">
        <div className="text-[20px] font-extrabold text-white">Chaweer</div>
        <div
          className="flex gap-6 text-[13.5px]"
          style={{ color: "rgba(255,255,255,.6)" }}
        >
          <span>{t("landing.footer.howItWorks")}</span>
          <span>{t("landing.footer.forLawyers")}</span>
          <span>{t("landing.footer.help")}</span>
          <span>{t("landing.footer.legal")}</span>
        </div>
        <div
          className="text-[13px]"
          style={{ color: "rgba(255,255,255,.4)" }}
        >
          {t("landing.footer.copyright")}
        </div>
      </div>
    </footer>
  );
}
