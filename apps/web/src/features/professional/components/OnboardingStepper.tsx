import { Check } from "lucide-react";

export type StepKey = "profile" | "expertise" | "offer";

interface OnboardingStepperProps {
  current: StepKey;
  done: { profile: boolean; expertise: boolean; offer: boolean };
}

const STEPS: Array<{ key: StepKey; label: string }> = [
  { key: "profile", label: "Profil" },
  { key: "expertise", label: "Expertise" },
  { key: "offer", label: "Offre" },
];

export function OnboardingStepper({ current, done }: OnboardingStepperProps) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <div>
      <ol className="flex items-center gap-2" aria-label="Progression de l'onboarding">
        {STEPS.map((step, index) => {
          const isDone = done[step.key];
          const isCurrent = step.key === current;
          const state = isCurrent ? "current" : isDone ? "done" : "todo";

          return (
            <li key={step.key} className="flex flex-1 items-center gap-2">
              <div className="flex items-center gap-2.5">
                <span
                  aria-current={isCurrent ? "step" : undefined}
                  className={
                    state === "done"
                      ? "flex h-8 w-8 items-center justify-center rounded-full bg-[#0F766E] text-white"
                      : state === "current"
                        ? "flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0F766E] text-[14px] font-bold text-[#0F766E]"
                        : "flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#E1DFDB] text-[14px] font-bold text-[#B4AFA6]"
                  }
                >
                  {state === "done" ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={
                    state === "todo"
                      ? "text-[14px] font-semibold text-[#9A968E]"
                      : "text-[14px] font-semibold text-[#1C1B1A]"
                  }
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <span
                  className={`mx-1 h-[2px] flex-1 rounded ${
                    index < currentIndex ? "bg-[#0F766E]" : "bg-[#E9E7E3]"
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-2.5 text-[13px] text-[#6B6862]">
        Étape {currentIndex + 1} sur 3 — complétez votre espace professionnel.
      </p>
    </div>
  );
}
