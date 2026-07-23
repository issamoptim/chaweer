import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Search, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { Card } from "../components/Card";
import { Chip } from "../components/Chip";
import { SkeletonPage } from "../components/Skeleton";
import { useProfessionalProfile } from "../hooks/useProfessionalProfile";
import { useReferential } from "../hooks/useReferential";
import { useUpdateExpertise } from "../hooks/useUpdateExpertise";
import type { SpecializationItem } from "../types/professional-types";

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const QUICK_SUGGESTIONS = [
  "Licenciement",
  "Divorce",
  "Litige locatif",
  "Contravention / amende",
  "Création d'entreprise",
  "Garde d'enfants",
];

export function ProfessionalExpertisePage() {
  const toast = useToast();
  const { data: profile, isLoading } = useProfessionalProfile();
  const { data: referential } = useReferential();
  const expertiseMutation = useUpdateExpertise();

  const [specs, setSpecs] = useState<Set<string>>(new Set());
  const [initialSpecs, setInitialSpecs] = useState<Set<string>>(new Set());
  const [areas, setAreas] = useState<Set<string>>(new Set());
  const [initialAreas, setInitialAreas] = useState<Set<string>>(new Set());
  const [languages, setLanguages] = useState<Set<string>>(new Set());
  const [initialLanguages, setInitialLanguages] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [openDomains, setOpenDomains] = useState<Set<string>>(new Set());

  const specializations = referential?.specializations ?? [];
  const allLanguages = referential?.languages ?? [];

  useEffect(() => {
    if (profile) {
      const s = new Set(profile.expertise.specializationIds);
      const a = new Set(profile.expertise.practiceAreaIds);
      const l = new Set(profile.expertise.languageIds);
      setSpecs(s);
      setInitialSpecs(s);
      setAreas(a);
      setInitialAreas(a);
      setLanguages(l);
      setInitialLanguages(l);
    }
  }, [profile]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = normalize(searchQuery);
    const results: { spec: SpecializationItem; areaId: string; areaName: string; isDomain: boolean }[] = [];
    for (const spec of specializations) {
      if (normalize(spec.name).includes(q)) {
        results.push({ spec, areaId: spec.id, areaName: spec.name, isDomain: true });
      }
      for (const area of spec.practiceAreas) {
        if (normalize(area.name).includes(q)) {
          results.push({ spec, areaId: area.id, areaName: area.name, isDomain: false });
        }
      }
    }
    return results.slice(0, 12);
  }, [searchQuery, specializations]);

  const activeDomains = useMemo(
    () => specializations.filter((s) => specs.has(s.id) || s.practiceAreas.some((a) => areas.has(a.id))),
    [specializations, specs, areas]
  );

  const totalSelectedSituations = areas.size;

  function toggleSpec(spec: SpecializationItem) {
    setSpecs((prev) => {
      const next = new Set(prev);
      if (next.has(spec.id)) {
        next.delete(spec.id);
        setAreas((prevAreas) => {
          const nextAreas = new Set(prevAreas);
          spec.practiceAreas.forEach((a) => nextAreas.delete(a.id));
          return nextAreas;
        });
        setOpenDomains((prevOpen) => {
          const nextOpen = new Set(prevOpen);
          nextOpen.delete(spec.id);
          return nextOpen;
        });
      } else {
        next.add(spec.id);
        setOpenDomains((prevOpen) => new Set(prevOpen).add(spec.id));
      }
      return next;
    });
  }

  function toggleArea(spec: SpecializationItem, areaId: string) {
    setAreas((prev) => {
      const next = new Set(prev);
      if (next.has(areaId)) {
        next.delete(areaId);
      } else {
        next.add(areaId);
        if (!specs.has(spec.id)) {
          setSpecs((prevSpecs) => new Set(prevSpecs).add(spec.id));
        }
      }
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
    if (select && !specs.has(spec.id)) {
      setSpecs((prev) => new Set(prev).add(spec.id));
    }
  }

  function toggleDomainOpen(specId: string) {
    setOpenDomains((prev) => {
      const next = new Set(prev);
      if (next.has(specId)) next.delete(specId);
      else next.add(specId);
      return next;
    });
  }

  function removeDomain(spec: SpecializationItem) {
    setSpecs((prev) => {
      const next = new Set(prev);
      next.delete(spec.id);
      return next;
    });
    setAreas((prev) => {
      const next = new Set(prev);
      spec.practiceAreas.forEach((a) => next.delete(a.id));
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

  function addFromSearch(spec: SpecializationItem, areaId: string, isDomain: boolean) {
    if (isDomain) {
      setSpecs((prev) => new Set(prev).add(spec.id));
      setOpenDomains((prev) => new Set(prev).add(spec.id));
    } else {
      setAreas((prev) => new Set(prev).add(areaId));
      if (!specs.has(spec.id)) {
        setSpecs((prev) => new Set(prev).add(spec.id));
      }
    }
  }

  const isExpertiseDirty =
    JSON.stringify([...specs].sort()) !== JSON.stringify([...initialSpecs].sort()) ||
    JSON.stringify([...areas].sort()) !== JSON.stringify([...initialAreas].sort());
  const isLanguagesDirty =
    JSON.stringify([...languages].sort()) !== JSON.stringify([...initialLanguages].sort());
  const isDirty = isExpertiseDirty || isLanguagesDirty;
  const isSaving = expertiseMutation.isPending;

  async function handleSubmit() {
    if (!isDirty) return;
    expertiseMutation.mutate(
      {
        specializationIds: [...specs],
        practiceAreaIds: [...areas],
        languageIds: [...languages],
      },
      {
        onSuccess: () => {
          setInitialSpecs(new Set(specs));
          setInitialAreas(new Set(areas));
          setInitialLanguages(new Set(languages));
          toast.showSuccess("Modifications enregistrées.");
        },
        onError: () => toast.showError("Impossible d'enregistrer votre expertise."),
      }
    );
  }

  function countAreasForSpec(spec: SpecializationItem): number {
    return spec.practiceAreas.filter((a) => areas.has(a.id)).length;
  }

  function isDomainAdded(spec: SpecializationItem, areaId: string, isDomain: boolean): boolean {
    if (isDomain) return specs.has(spec.id);
    return areas.has(areaId);
  }

  if (isLoading) {
    return <SkeletonPage cards={2} />;
  }

  const selectedLanguageNames = allLanguages
    .filter((l) => languages.has(l.id))
    .map((l) => l.name);

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-[27px] font-bold tracking-[-0.02em] text-[#1C1B1A]">Expertise</h1>
        <p className="mt-1 text-[14.5px] text-[#6B6862]">
          Indiquez ce que vous prenez en charge pour être proposé aux bons clients, au bon moment.
        </p>
      </header>

      <div className="flex flex-col gap-5">
        {/* Carte 1 — Ce que vous traitez */}
        <Card title="Ce que vous traitez">
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Colonne gauche — recherche + accordion */}
            <div className="flex flex-1 flex-col gap-4">
              {/* Recherche */}
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A968E]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ajouter une situation… ex. « licenciement », « divorce », « litige locatif »"
                    className="h-[46px] w-full rounded-[10px] border-[1.5px] border-[#E7E5E1] bg-white pl-10 pr-4 text-[14px] font-medium text-[#1C1B1A] placeholder:text-[#B4AFA6] focus:border-[#0F766E] focus:outline-none focus:ring-[3px] focus:ring-[rgba(20,184,166,0.35)]"
                  />
                </div>
                {searchQuery.trim() && searchResults.length > 0 && (
                  <div className="flex flex-col gap-1 rounded-[10px] border border-[#E9E7E3] bg-white p-2 shadow-sm">
                    {searchResults.map((r) => {
                      const added = isDomainAdded(r.spec, r.areaId, r.isDomain);
                      return (
                        <button
                          key={`${r.areaId}-${r.isDomain}`}
                          type="button"
                          onClick={() => addFromSearch(r.spec, r.areaId, r.isDomain)}
                          className={`flex items-center justify-between rounded-[8px] px-3 py-2 text-left text-[13px] transition-colors ${
                            added
                              ? "bg-[#E6F2F0] text-[#0F766E]"
                              : "hover:bg-[#F7F7F5] text-[#1C1B1A]"
                          }`}
                        >
                          <span>
                            <span className="font-semibold">{r.areaName}</span>
                            <span className="text-[#9A968E]"> · {r.spec.name}</span>
                            {r.isDomain && (
                              <span className="ml-1 text-[11px] font-bold text-[#0F766E]">+ Domaine entier</span>
                            )}
                          </span>
                          {added && (
                            <span className="flex items-center gap-1 text-[12px] font-semibold text-[#0F766E]">
                              <Check className="h-3 w-3" strokeWidth={3} />
                              Ajouté
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
                {searchQuery.trim() && searchResults.length === 0 && (
                  <p className="px-3 py-2 text-[13px] text-[#9A968E]">
                    Aucun résultat pour « {searchQuery} ».
                  </p>
                )}
                <p className="text-[12px] text-[#9A968E]">
                  Astuce : pour tout un domaine sans détailler, cochez sa case dans « Parcourir les {specializations.length} domaines » ci-dessous.
                </p>
              </div>

              {/* Accordion — Parcourir les domaines */}
              <div className="flex flex-col gap-2">
                <span className="text-[13.5px] font-semibold text-[#1C1B1A]">
                  Parcourir les {specializations.length} domaines
                </span>
                <div className="flex flex-col gap-1.5">
                  {specializations.map((spec) => {
                    const isOpen = openDomains.has(spec.id);
                    const isSpecChecked = specs.has(spec.id);
                    const count = countAreasForSpec(spec);
                    const total = spec.practiceAreas.length;
                    const allSelected = count === total;
                    return (
                      <div
                        key={spec.id}
                        className="rounded-[12px] border border-[#E9E7E3] bg-white"
                      >
                        {/* En-tête du domaine */}
                        <div className="flex items-center gap-2.5 px-3 py-2.5">
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={isSpecChecked}
                            onClick={() => toggleSpec(spec)}
                            disabled={isSaving}
                            className={`flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] transition-colors ${
                              isSpecChecked
                                ? "border-[#0F766E] bg-[#0F766E] text-white"
                                : "border-[#CBC8C2] bg-white hover:border-[#0F766E]"
                            }`}
                          >
                            {isSpecChecked && <Check className="h-3 w-3" strokeWidth={3} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleDomainOpen(spec.id)}
                            className="flex flex-1 items-center justify-between text-left"
                          >
                            <span className="text-[14px] font-bold text-[#1C1B1A]">{spec.name}</span>
                            <div className="flex items-center gap-2">
                              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                isSpecChecked || count > 0
                                  ? "bg-[#E6F2F0] text-[#0F766E]"
                                  : "bg-[#F2F1EF] text-[#9A968E]"
                              }`}>
                                {isSpecChecked && count === 0 ? "Domaine entier" : `${count}/${total}`}
                              </span>
                              <ChevronDown
                                className={`h-4 w-4 text-[#9A968E] transition-transform ${isOpen ? "rotate-180" : ""}`}
                              />
                            </div>
                          </button>
                        </div>
                        {/* Bloc situations */}
                        {isOpen && (
                          <div className="border-t border-[#F0EEEA] px-3 py-3">
                            <div className="mb-2 flex justify-end">
                              <button
                                type="button"
                                onClick={() => setAllAreas(spec, !allSelected)}
                                disabled={isSaving}
                                className="text-[12px] font-semibold text-[#0F766E] hover:underline disabled:opacity-60"
                              >
                                {allSelected ? "Tout désélectionner" : "Tout sélectionner"}
                              </button>
                            </div>
                            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                              {spec.practiceAreas.map((area) => {
                                const checked = areas.has(area.id);
                                return (
                                  <button
                                    key={area.id}
                                    type="button"
                                    role="checkbox"
                                    aria-checked={checked}
                                    onClick={() => toggleArea(spec, area.id)}
                                    disabled={isSaving}
                                    className={`flex items-center gap-2.5 rounded-[8px] border px-3 py-2 text-left text-[13px] font-medium transition-colors ${
                                      checked
                                        ? "border-[#0F766E] bg-[#E6F2F0] text-[#0F766E]"
                                        : "border-[#E7E5E1] bg-white text-[#4B4842] hover:border-[#CDE5E1]"
                                    }`}
                                  >
                                    <span
                                      className={`flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-[4px] border ${
                                        checked
                                          ? "border-[#0F766E] bg-[#0F766E] text-white"
                                          : "border-[#CBC8C2] bg-white"
                                      }`}
                                    >
                                      {checked && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                                    </span>
                                    {area.name}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Colonne droite — Votre sélection (sticky) */}
            <div className="w-full shrink-0 lg:w-[210px]">
              <div className="sticky top-4 flex flex-col gap-3 rounded-[12px] border border-[#E9E7E3] bg-[#F7F7F5] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[13.5px] font-bold text-[#1C1B1A]">Votre sélection</span>
                  <span className="rounded-full bg-[#0F766E] px-2 py-0.5 text-[11px] font-bold text-white">
                    {totalSelectedSituations}
                  </span>
                </div>
                {activeDomains.length === 0 ? (
                  <div className="flex flex-col gap-3 rounded-[10px] border border-dashed border-[#D9D6D0] bg-white/60 px-3 py-5 text-center">
                    <p className="text-[12.5px] text-[#9A968E]">
                      Rien pour l'instant. Ajoutez une situation ou cochez un domaine à gauche.
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {QUICK_SUGGESTIONS.map((s) => {
                        const found = specializations.find((spec) =>
                          spec.practiceAreas.some((a) => normalize(a.name).includes(normalize(s)))
                        );
                        const foundArea = found?.practiceAreas.find((a) =>
                          normalize(a.name).includes(normalize(s))
                        );
                        if (!found || !foundArea) return null;
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => addFromSearch(found, foundArea.id, false)}
                            className="rounded-[8px] border border-[#CDE5E1] bg-white px-2.5 py-1.5 text-[12px] font-medium text-[#0F766E] transition-colors hover:bg-[#E6F2F0]"
                          >
                            + {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {activeDomains.map((spec) => {
                      const count = countAreasForSpec(spec);
                      const isEntire = specs.has(spec.id) && count === 0;
                      return (
                        <div
                          key={spec.id}
                          className="flex items-center gap-1.5 rounded-[8px] border border-[#CDE5E1] bg-[#E6F2F0] px-2.5 py-2"
                        >
                          <button
                            type="button"
                            onClick={() => toggleDomainOpen(spec.id)}
                            className="flex flex-1 flex-col text-left"
                          >
                            <span className="text-[12.5px] font-bold text-[#0F766E]">{spec.name}</span>
                            <span className="text-[11px] text-[#0F766E]/70">
                              {isEntire ? "Domaine entier" : `${count} situation${count > 1 ? "s" : ""}`}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => removeDomain(spec)}
                            disabled={isSaving}
                            className="flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full text-[#9A968E] transition-colors hover:bg-white hover:text-[#B4231F]"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Carte 2 — Langues de consultation */}
        <Card title="Langues de consultation">
          {allLanguages.length > 0 ? (
            <div className="flex flex-wrap gap-2.5">
              {allLanguages.map((lang) => (
                <Chip
                  key={lang.id}
                  label={lang.name}
                  selected={languages.has(lang.id)}
                  onToggle={() => toggleLanguage(lang.id)}
                  disabled={isSaving}
                />
              ))}
            </div>
          ) : (
            <p className="text-[13.5px] text-[#9A968E]">Aucune langue disponible.</p>
          )}
          {selectedLanguageNames.length === 0 && allLanguages.length > 0 && (
            <p className="mt-2 text-[12.5px] italic text-[#B4AFA6]">Aucune langue sélectionnée.</p>
          )}
        </Card>
      </div>

      {/* Barre d'action — bouton Enregistrer */}
      <div className="mt-6 flex items-center justify-end gap-3">
        {isDirty && (
          <span className="text-[13px] text-[#9A968E]">Modifications non enregistrées</span>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isDirty || isSaving}
          className="flex h-[44px] items-center gap-2 rounded-[10px] bg-[#0F766E] px-6 text-[14px] font-semibold text-white transition-colors hover:bg-[#134E4A] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(20,184,166,0.35)] disabled:cursor-not-allowed disabled:bg-[#9A968E]"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSaving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}
