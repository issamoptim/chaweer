interface ChaweerLogoProps {
  collapsed?: boolean;
  showArabic?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { icon: 28, text: "text-[15px]", arabic: "text-[12px]" },
  md: { icon: 36, text: "text-[18px]", arabic: "text-[14px]" },
  lg: { icon: 72, text: "text-[34px]", arabic: "text-[16px]" },
};

export function ChaweerLogo({ collapsed = false, showArabic = true, size = "md" }: ChaweerLogoProps) {
  const s = sizeMap[size];

  if (collapsed) {
    return (
      <span
        className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F766E] text-[15px] font-bold text-white"
        aria-label="Chaweer"
      >
        C
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <svg
          width={s.icon}
          height={s.icon}
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
        >
          <path d="M10 20h44" stroke="#134E4A" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M32 20v24" stroke="#134E4A" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M32 40l-9 10h18z" fill="#134E4A" />
          <path d="M10 20v4" stroke="#134E4A" strokeWidth="3" strokeLinecap="round" />
          <path d="M54 20v4" stroke="#134E4A" strokeWidth="3" strokeLinecap="round" />
          <path
            d="M4 26h14a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-7l-5 4 1-4h-3a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3z"
            fill="#0F766E"
            transform="translate(3,0)"
          />
          <path
            d="M46 26h11a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-2l1 4-5-4h-5a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3z"
            fill="#14B8A6"
          />
        </svg>
        <span
          className={`${s.text} font-extrabold tracking-[-0.02em] text-[#134E4A]`}
          style={{ lineHeight: 1 }}
        >
          Chaweer
        </span>
      </div>
      {showArabic && (
        <span
          dir="rtl"
          className={`${s.arabic} font-bold text-[#0F766E]`}
          style={{ fontFamily: "'Noto Kufi Arabic', sans-serif", marginTop: "2px" }}
        >
          شاور
        </span>
      )}
    </div>
  );
}
