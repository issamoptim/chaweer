import { useTranslation } from "react-i18next";
import { ChaweerLogo } from "@/components/ChaweerLogo";

export function LandingFooter() {
  const { t } = useTranslation();

  return (
    <footer
      className="px-12 pb-7 pt-10 sm:px-20 lg:px-28"
      style={{ background: "#0C3D38" }}
    >
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-5">
        <div className="[&_svg_path]:!stroke-white [&_span]:!text-white">
          <ChaweerLogo size="sm" showArabic={false} />
        </div>
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
