import { useTranslation } from "react-i18next";

const STEP_ICONS = [
  <>
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </>,
  <>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </>,
  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.71 3.35a2 2 0 0 1 2-1.85h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6z" />,
];

export function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      title: t("landing.howItWorks.steps.step1.title"),
      desc: t("landing.howItWorks.steps.step1.desc"),
    },
    {
      title: t("landing.howItWorks.steps.step2.title"),
      desc: t("landing.howItWorks.steps.step2.desc"),
    },
    {
      title: t("landing.howItWorks.steps.step3.title"),
      desc: t("landing.howItWorks.steps.step3.desc"),
    },
  ];

  return (
    <section
      id="comment-ca-marche"
      className="border-t border-[#EFEDE9] bg-white px-5 py-16 sm:px-12"
    >
      <div className="mx-auto max-w-[860px]">
        <h2
          className="mb-11 text-center text-[28px] font-extrabold"
          style={{ letterSpacing: "-0.02em" }}
        >
          {t("landing.howItWorks.title")}
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[14px]"
                style={{ background: "#E6F2F0" }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0F766E"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {STEP_ICONS[i]}
                </svg>
              </div>
              <div className="mb-[7px] text-base font-bold">
                {step.title}
              </div>
              <div
                className="text-[13.5px] leading-[1.6]"
                style={{ color: "#6B6862" }}
              >
                {step.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
