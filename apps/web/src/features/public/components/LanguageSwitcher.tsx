import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown, Check } from "lucide-react";
import type { SupportedLanguage } from "@/i18n";

interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  shortLabel: string;
  flag: React.ReactNode;
}

function FlagFR({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 18" className={className} aria-hidden="true">
      <rect width="8" height="18" fill="#0055A4" />
      <rect x="8" width="8" height="18" fill="#FFFFFF" />
      <rect x="16" width="8" height="18" fill="#EF4135" />
    </svg>
  );
}

function FlagMA({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 18" className={className} aria-hidden="true">
      <rect width="24" height="18" fill="#C1272D" />
      <path
        d="M12 5.5l1.2 3.7h3.9l-3.15 2.3 1.2 3.7L12 12.9l-3.15 2.3 1.2-3.7L6.9 9.2h3.9z"
        fill="none"
        stroke="#006233"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function FlagGB({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 18" className={className} aria-hidden="true">
      <rect width="24" height="18" fill="#012169" />
      <path d="M0 0l24 18M24 0L0 18" stroke="#FFFFFF" strokeWidth="3.6" />
      <path d="M0 0l24 18M24 0L0 18" stroke="#C8102E" strokeWidth="2.4" />
      <path d="M12 0v18M0 9h24" stroke="#FFFFFF" strokeWidth="6" />
      <path d="M12 0v18M0 9h24" stroke="#C8102E" strokeWidth="4" />
    </svg>
  );
}

const LANGUAGES: LanguageOption[] = [
  { code: "fr", label: "Français", shortLabel: "FR", flag: <FlagFR /> },
  { code: "ar", label: "العربية", shortLabel: "AR", flag: <FlagMA /> },
  { code: "en", label: "English", shortLabel: "EN", flag: <FlagGB /> },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLang =
    LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  const changeLanguage = useCallback(
    (lang: SupportedLanguage) => {
      void i18n.changeLanguage(lang);
      setOpen(false);
    },
    [i18n],
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-[9px] px-2.5 py-2 text-sm font-medium text-[#4B4A46] transition-colors hover:bg-surface-alt"
      >
        <Globe className="size-4 text-text-faint" />
        <span className="h-3 w-4 overflow-hidden rounded-[2px]">
          {currentLang.flag}
        </span>
        <span className="hidden sm:inline">{currentLang.label}</span>
        <span className="sm:hidden">{currentLang.shortLabel}</span>
        <ChevronDown
          className={`size-3.5 text-text-faint transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-[calc(100%+4px)] z-50 min-w-[160px] overflow-hidden rounded-[12px] border border-border bg-white py-1 shadow-[0_12px_32px_rgba(19,78,74,.14)]"
        >
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                role="option"
                aria-selected={lang.code === currentLang.code}
                onClick={() => changeLanguage(lang.code)}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-surface-alt"
              >
                <span className="h-3 w-4 flex-shrink-0 overflow-hidden rounded-[2px]">
                  {lang.flag}
                </span>
                <span
                  className={
                    lang.code === currentLang.code
                      ? "font-bold text-primary"
                      : "font-medium text-foreground"
                  }
                >
                  {lang.label}
                </span>
                {lang.code === currentLang.code && (
                  <Check className="ml-auto size-4 text-primary" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
