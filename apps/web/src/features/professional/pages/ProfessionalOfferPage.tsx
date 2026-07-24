import { useEffect, useState } from "react";
import { Video, Phone, MessageCircle, Trash2, Pencil, Plus } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { Card } from "../components/Card";
import { ProInput } from "../components/ProInput";
import { ProTextarea } from "../components/ProTextarea";
import { ToggleCard } from "../components/ToggleCard";
import { ReadField } from "../components/ReadField";
import { EditActionBar } from "../components/EditActionBar";
import { SkeletonPage } from "../components/Skeleton";
import { useProfessionalProfile } from "../hooks/useProfessionalProfile";
import { useUpdateOffer } from "../hooks/useUpdateOffer";
import { useDeleteOffer } from "../hooks/useDeleteOffer";
import type { ConsultationModality } from "../types/professional-types";

export function ProfessionalOfferPage() {
  const toast = useToast();
  const { data: profile, isLoading } = useProfessionalProfile();
  const mutation = useUpdateOffer();
  const deleteMutation = useDeleteOffer();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [initialTitle, setInitialTitle] = useState("");
  const [description, setDescription] = useState("");
  const [initialDescription, setInitialDescription] = useState("");
  const [price, setPrice] = useState("");
  const [initialPrice, setInitialPrice] = useState("");
  const [modalities, setModalities] = useState<Set<ConsultationModality>>(new Set(["VIDEO"]));
  const [initialModalities, setInitialModalities] = useState<Set<ConsultationModality>>(new Set(["VIDEO"]));
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const offer = profile?.offers?.[0] ?? null;

  useEffect(() => {
    if (offer) {
      const t = offer.title ?? "";
      const d = offer.description ?? "";
      const p = String(offer.price);
      const m = new Set(offer.modalities);
      setTitle(t);
      setInitialTitle(t);
      setDescription(d);
      setInitialDescription(d);
      setPrice(p);
      setInitialPrice(p);
      setModalities(m);
      setInitialModalities(m);
    }
  }, [offer]);

  function toggleModality(m: ConsultationModality) {
    if (!isEditing) return;
    setModalities((prev) => {
      const next = new Set(prev);
      if (next.has(m)) next.delete(m);
      else next.add(m);
      return next;
    });
  }

  const priceNumber = Number(price);
  const canSave =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    Number.isInteger(priceNumber) &&
    priceNumber > 0 &&
    modalities.size > 0;

  const isDirty =
    title !== initialTitle ||
    description !== initialDescription ||
    price !== initialPrice ||
    JSON.stringify([...modalities].sort()) !== JSON.stringify([...initialModalities].sort());

  const titleError = touched.title && !title.trim() ? "Le titre est obligatoire" : null;
  const descriptionError = touched.description && !description.trim() ? "La description est obligatoire" : null;

  function handleCancel() {
    setTitle(initialTitle);
    setDescription(initialDescription);
    setPrice(initialPrice);
    setModalities(initialModalities);
    setTouched({});
    setIsEditing(false);
  }

  function handleSubmit() {
    if (!isDirty) {
      setIsEditing(false);
      return;
    }
    mutation.mutate(
      {
        title: title.trim(),
        description: description.trim(),
        price: priceNumber,
        modalities: [...modalities],
      },
      {
        onSuccess: () => {
          setInitialTitle(title);
          setInitialDescription(description);
          setInitialPrice(price);
          setInitialModalities(new Set(modalities));
          toast.showSuccess("Offre enregistrée avec succès.");
          setIsEditing(false);
        },
        onError: () => toast.showError("Impossible d'enregistrer votre offre."),
      }
    );
  }

  const modalityLabels: Record<ConsultationModality, string> = {
    VIDEO: "Visioconférence",
    AUDIO: "Téléphone",
    CHAT: "Messagerie",
  };

  const activeModalities = offer ? [...offer.modalities] : [];

  function handleDelete() {
    if (!offer) return;
    if (!window.confirm("Supprimer votre offre de consultation ? Cette action est irréversible.")) return;
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setTitle("");
        setInitialTitle("");
        setDescription("");
        setInitialDescription("");
        setPrice("");
        setInitialPrice("");
        setModalities(new Set(["VIDEO"]));
        setInitialModalities(new Set(["VIDEO"]));
        toast.showSuccess("Offre supprimée avec succès.");
      },
      onError: () => toast.showError("Impossible de supprimer l'offre."),
    });
  }

  if (isLoading) {
    return <SkeletonPage cards={3} />;
  }

  return (
    <div>
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[27px] font-bold tracking-[-0.02em] text-[#1C1B1A]">Consultation</h1>
          <p className="mt-1 text-[14.5px] text-[#6B6862]">Définissez les conditions de votre consultation.</p>
          <p className="mt-2 text-[13px] font-medium text-[#0F766E]">Un titre et une description clairs augmentent vos chances de réservation.</p>
        </div>
        {!isEditing && (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex h-[42px] items-center gap-2 rounded-[10px] border-[1.5px] border-[#0F766E] px-4 text-[14px] font-semibold text-[#0F766E] transition-colors hover:bg-[#E6F2F0] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(20,184,166,0.35)]"
            >
              {offer ? (
                <>
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Modifier
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Ajouter
                </>
              )}
            </button>
            {offer && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex h-[42px] items-center gap-2 rounded-[10px] border-[1.5px] border-[#B4231F] px-4 text-[14px] font-semibold text-[#B4231F] transition-colors hover:bg-[#FBF2F2] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(180,35,31,0.20)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                {deleteMutation.isPending ? "Suppression…" : "Supprimer"}
              </button>
            )}
          </div>
        )}
      </header>

      <div className="flex flex-col gap-5">
        {/* Carte 1 — Titre + Description */}
        <Card title="Consultation">
          {isEditing ? (
            <div className="flex flex-col gap-5">
              <ProInput
                label="Titre"
                name="title"
                value={title}
                onChange={setTitle}
                placeholder="Consultation juridique en droit du travail"
                disabled={mutation.isPending}
                required
                error={titleError}
                hint="Soyez clair et descriptif. Évitez les titres génériques."
                onBlur={() => setTouched((t) => ({ ...t, title: true }))}
              />
              <ProTextarea
                label="Description"
                name="description"
                value={description}
                onChange={setDescription}
                placeholder="Cette consultation inclut l'analyse de votre situation, des conseils juridiques adaptés et un plan d'action…"
                maxLength={500}
                disabled={mutation.isPending}
                required
                error={descriptionError}
                hint="Maximum 500 caractères. Décrivez ce que le client obtiendra."
                onBlur={() => setTouched((t) => ({ ...t, description: true }))}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <ReadField label="Titre" value={offer?.title} />
              <ReadField label="Description" value={offer?.description} />
            </div>
          )}
        </Card>

        {/* Carte 2 — Tarif + Modalités */}
        <Card title="Tarif & modalités">
          {isEditing ? (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[13.5px] font-semibold text-[#1C1B1A]">Tarif</label>
                <div className="relative w-full max-w-[220px]">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={price}
                    onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="300"
                    aria-label="Tarif en dirhams"
                    disabled={mutation.isPending}
                    className="h-[50px] w-full rounded-[12px] border-[1.5px] border-[#E7E5E1] bg-white px-[15px] pr-12 text-[15px] font-medium text-[#1C1B1A] placeholder:text-[#B4AFA6] focus:border-[#0F766E] focus:outline-none focus:ring-[3px] focus:ring-[rgba(20,184,166,0.40)]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] font-semibold text-[#6B6862]">
                    DH
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-[13.5px] font-semibold text-[#1C1B1A]">Modalités</span>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <ToggleCard
                    title="Vidéo"
                    icon={Video}
                    selected={modalities.has("VIDEO")}
                    onToggle={() => toggleModality("VIDEO")}
                    disabled={mutation.isPending}
                  />
                  <ToggleCard
                    title="Audio"
                    icon={Phone}
                    selected={modalities.has("AUDIO")}
                    onToggle={() => toggleModality("AUDIO")}
                    disabled={mutation.isPending}
                  />
                  <ToggleCard
                    title="Chat"
                    icon={MessageCircle}
                    selected={modalities.has("CHAT")}
                    onToggle={() => toggleModality("CHAT")}
                    disabled={mutation.isPending}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-semibold uppercase tracking-wide text-[#9A968E]">
                  Tarif
                </span>
                {offer && offer.price > 0 ? (
                  <span className="text-[20px] font-extrabold text-[#0F766E]">
                    {offer.price} DH
                  </span>
                ) : (
                  <span className="text-[14.5px] italic text-[#B4AFA6]">Non renseigné</span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-semibold uppercase tracking-wide text-[#9A968E]">
                  Modalités
                </span>
                {activeModalities.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {activeModalities.map((m) => (
                      <span
                        key={m}
                        className="rounded-full border border-[#CDE5E1] bg-[#E6F2F0] px-3 py-1 text-[13px] font-medium text-[#0F766E]"
                      >
                        {modalityLabels[m]}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[14.5px] italic text-[#B4AFA6]">Non renseigné</span>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>

      <EditActionBar
        isEditing={isEditing}
        isSaving={mutation.isPending}
        canSave={canSave}
        onSave={handleSubmit}
        onCancel={handleCancel}
        status={isDirty ? "Modifications non enregistrées" : undefined}
      />
    </div>
  );
}
