import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, Layers } from "lucide-react";
import { PrimaryButton } from "@/features/auth";
import { useToast } from "@/hooks/useToast";
import { ToggleCard } from "../components/ToggleCard";
import { Chip } from "../components/Chip";
import { StickyActionBar } from "../components/StickyActionBar";
import { useProfessionalProfile } from "../hooks/useProfessionalProfile";
import { useReferential } from "../hooks/useReferential";
import { useUpdateExpertise } from "../hooks/useUpdateExpertise";
import type { SpecializationItem } from "../types/professional-types";

export function ProfessionalExpertisePage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { data: profile } = useProfessionalProfile();
  const { data: referential } = useReferential();
  const mutation = useUpdateExpertise();

  const [specs, setSpecs] = useState<Set<string>>(new Set());
  const [areas, setAreas] = useState<Set<string>>(new Set());
  const [languages, setLanguages] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (profile) {
      setSpecs(new Set(profile.specializationIds));
      setAreas(new Set(profile.practiceAreaIds));
      setLanguages(new Set(profile.languageIds));
    }
  }, [profile]);

  const specializations = referential?.specializations ?? [];
  const selectedSpecs = useMemo(
    () => specializations.filter((s) => specs.has(s.id)),
    [specializations, specs]
  );

  function toggleSpec(spec: SpecializationItem) {
    setSpecs((prev) => {
      const next = new Set(prev);
      if (next.has(spec.id)) {
        next.delete(spec.id);
        // Remove its practice areas from selection
        setAreas((prevAreas) => {
          const nextAreas = new Set(prevAreas);
          spec.practiceAreas.forEach((a) => nextAreas.delete(a.id));
          return nextAreas;
        });
      } else {
        next.add(spec.id);
      }
      return next;
    });
  }

  function toggleArea(id: string) {
    setAreas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleLanguage(id: string) {
    setLanguages((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function setAllAreas(spec: SpecializationItem, select: boolean) {
    setAreas((prev) => {
      const next = new Set(prev);
      spec.practiceAreas.forEach((a) => {
        if (select) next.add(a.id);
        else next.delete(a.id);
      });
      return next;
    });
  }

  function countAreasForSpec(spec: SpecializationItem): number {
    return spec.practiceAreas.filter((a) => areas.has(a.id)).length;
  }

  const canContinue = specs.size > 0 && areas.size > 0 && languages.size > 0;

  function handleSubmit() {
    mutation.mutate(
      {
        specializationIds: [...specs],
        practiceAreaIds: [...areas],
        languageIds: [...languages],
      },
      {
        onSuccess: () => navigate("/pro/offre"),
        onError: () => toast.showError("Impossible d'enregistrer votre expertise."),
      }
    );
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-[26px] font-bold tracking-[-0.02em] text-[#1C1B1A]">Mon expertise</h1>
        <p className="mt-1 text-[14.5px] text-[#6B6862]">
          Vos clients décrivent un problème concret, pas un domaine du droit. Indiquez les
          situations que vous traitez pour être proposé au bon moment.
        </p>
      </header>

      <div className="flex flex-col gap-8">
        {/* Block 1 — Specialties */}
        <section>
          <h2 className="mb-3 text-[16px] font-bold text-[#1C1B1A]">1. Vos spécialités</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {specializations.map((spec) => {
              const count = countAreasForSpec(spec);
              const isSelected = specs.has(spec.id);
              return (
                <ToggleCard
                  key={spec.id}
                  title={spec.name}
                  selected={isSelected}
                  onToggle={() => toggleSpec(spec)}
                  subtitle={
                    isSelected
                      ? count > 0
                        ? `${count} situation${count > 1 ? "s" : ""} sélectionnée${count > 1 ? "s" : ""}`
                        : "Aucune situation sélectionnée"
                      : undefined
                  }
                />
              );
            })}
          </div>
        </section>

        {/* Block 2 — Situations */}
        <section>
          <h2 className="mb-3 text-[16px] font-bold text-[#1C1B1A]">
            2. Situations que vous traitez
          </h2>
          {selectedSpecs.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-[12px] border border-dashed border-[#D9D6D0] bg-white/60 px-6 py-10 text-center">
              <Layers className="h-7 w-7 text-[#B4AFA6]" aria-hidden="true" />
              <p className="max-w-sm text-[13.5px] text-[#6B6862]">
                Sélectionnez au moins une spécialité ci-dessus pour configurer les situations
                associées.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {selectedSpecs.map((spec) => {
                const count = countAreasForSpec(spec);
                const total = spec.practiceAreas.length;
                const allSelected = count === total;
                return (
                  <div
                    key={spec.id}
                    className="rounded-[14px] border border-[#E9E7E3] bg-white p-5"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="text-[14.5px] font-bold text-[#1C1B1A]">{spec.name}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-[12.5px] text-[#6B6862]">
                          {count}/{total} sélectionnées
                        </span>
                        <button
                          type="button"
                          onClick={() => setAllAreas(spec, !allSelected)}
                          className="text-[12.5px] font-semibold text-[#0F766E] hover:underline"
                        >
                          {allSelected ? "Tout désélectionner" : "Tout sélectionner"}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {spec.practiceAreas.map((area) => {
                        const checked = areas.has(area.id);
                        return (
                          <button
                            key={area.id}
                            type="button"
                            role="checkbox"
                            aria-checked={checked}
                            onClick={() => toggleArea(area.id)}
                            className={`flex items-center gap-2.5 rounded-[10px] border px-3 py-2.5 text-left text-[13.5px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(20,184,166,0.40)] ${
                              checked
                                ? "border-[#0F766E] bg-[#E6F2F0] text-[#0F766E]"
                                : "border-[#E7E5E1] bg-white text-[#4B4842] hover:border-[#CDE5E1]"
                            }`}
                          >
                            <span
                              className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border ${
                                checked
                                  ? "border-[#0F766E] bg-[#0F766E] text-white"
                                  : "border-[#CBC8C2] bg-white"
                              }`}
                            >
                              {checked && <Check className="h-3 w-3" strokeWidth={3} />}
                            </span>
                            {area.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Block 3 — Languages */}
        <section>
          <h2 className="mb-3 text-[16px] font-bold text-[#1C1B1A]">3. Langues de consultation</h2>
          <div className="flex flex-wrap gap-2.5">
            {(referential?.languages ?? []).map((lang) => (
              <Chip
                key={lang.id}
                label={lang.name}
                selected={languages.has(lang.id)}
                onToggle={() => toggleLanguage(lang.id)}
              />
            ))}
          </div>
        </section>
      </div>

      <StickyActionBar
        status={
          canContinue
            ? `${specs.size} spécialité${specs.size > 1 ? "s" : ""} · ${areas.size} situation${areas.size > 1 ? "s" : ""} · ${languages.size} langue${languages.size > 1 ? "s" : ""}`
            : "Sélectionnez au moins une spécialité, une situation et une langue."
        }
      >
        <PrimaryButton
          type="button"
          onClick={handleSubmit}
          loading={mutation.isPending}
          disabled={!canContinue || mutation.isPending}
          className="w-auto px-6"
        >
          Enregistrer et continuer
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </PrimaryButton>
      </StickyActionBar>
    </div>
  );
}
