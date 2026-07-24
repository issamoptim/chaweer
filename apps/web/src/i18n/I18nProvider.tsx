import { type ReactNode, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n, { isRTL } from "./config";

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    const setDirection = (lang: string) => {
      document.documentElement.dir = isRTL(lang) ? "rtl" : "ltr";
      document.documentElement.lang = lang;
    };

    setDirection(i18n.language);

    const handler = (lng: string) => setDirection(lng);
    i18n.on("languageChanged", handler);

    return () => {
      i18n.off("languageChanged", handler);
    };
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
