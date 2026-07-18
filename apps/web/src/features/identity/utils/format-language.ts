const languageLabels: Record<string, string> = {
  fr: "Français",
  ar: "العربية",
  en: "English",
};

export function formatLanguage(code: string | null): string {
  if (!code) return "Non renseigné";
  return languageLabels[code] ?? code;
}
