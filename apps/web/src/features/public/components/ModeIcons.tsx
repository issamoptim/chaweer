import type { ConsultationMode } from "@/features/public/types/lawyer";

interface ModeIconProps {
  mode: ConsultationMode;
  className?: string;
}

const ICON_PATHS: Record<ConsultationMode, React.ReactNode> = {
  Vidéo: (
    <>
      <path d="M23 7l-7 5 7 5V7z" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
    </>
  ),
  Audio: (
    <>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12" />
      <path d="M22 2L11 13" />
    </>
  ),
  Cabinet: (
    <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1M9 13h1M14 9h1M14 13h1" />
  ),
  Chat: (
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  ),
};

const MODE_LABEL_KEYS: Record<ConsultationMode, string> = {
  Vidéo: "landing.modes.video",
  Audio: "landing.modes.audio",
  Cabinet: "landing.modes.office",
  Chat: "landing.modes.chat",
};

export { ICON_PATHS, MODE_LABEL_KEYS };
export type { ModeIconProps };
