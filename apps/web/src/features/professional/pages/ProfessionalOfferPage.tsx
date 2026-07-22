import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Video, Phone, MessageCircle, ArrowRight } from "lucide-react";
import { PrimaryButton } from "@/features/auth";
import { useToast } from "@/hooks/useToast";
import { Card } from "../components/Card";
import { ProInput } from "../components/ProInput";
import { ProTextarea } from "../components/ProTextarea";
import { ToggleCard } from "../components/ToggleCard";
import { OfferPreviewCard } from "../components/OfferPreviewCard";
import { StickyActionBar } from "../components/StickyActionBar";
import { useProfessionalProfile } from "../hooks/useProfessionalProfile";
import { useReferential } from "../hooks/useReferential";
import { useUpdateOffer } from "../hooks/useUpdateOffer";
import type { ConsultationModality } from "../types/professional-types";

export function ProfessionalOfferPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { data: profile } = useProfessionalProfile();
  const { data: referential } = useReferential();
  const mutation = useUpdateOffer();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [modalities, setModalities] = useState<Set<ConsultationModality>>(new Set(["VIDEO"]));
  const [finished, setFinished] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (profile?.offers?.length > 0) {
      const offer = profile.offers[0];
      setTitle(offer.title ?? "");
      setDescription(offer.description ?? "");
      setPrice(String(offer.price));
      setModalities(new Set(offer.modalities));
    }
  }, [profile]);

  function toggleModality(m: ConsultationModality) {
    setModalities((prev) => {
      const next = new Set(prev);
      if (next.has(m)) next.delete(m);
      else next.add(m);
      return next;
    });
  }

  const priceNumber = Number(price);
  const canFinish =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    Number.isInteger(priceNumber) &&
    priceNumber > 0 &&
    modalities.size > 0;

  const titleError = touched.title && !title.trim() ? "Le titre est obligatoire" : null;
  const descriptionError = touched.description && !description.trim() ? "La description est obligatoire" : null;

  const previewData = useMemo(() => {
    const name =
      profile && (profile.identity.firstName || profile.identity.lastName)
        ? `${profile.identity.firstName} ${profile.identity.lastName}`.trim()
        : "";
    const cityName = referential?.cities.find((c) => c.id === profile?.office?.cityId)?.name ?? null;
    const specialtyNames =
      referential?.specializations
        .filter((s) => profile?.expertise.specializationIds.includes(s.id))
        .map((s) => s.name) ?? [];
    return { name, cityName, specialtyNames };
  }, [profile, referential]);

  function handleSubmit() {
    mutation.mutate(
      {
        title: title.trim(),
        description: description.trim(),
        price: priceNumber,
        modalities: [...modalities],
      },
      {
        onSuccess: () => setFinished(true),
        onError: () => toast.showError("Impossible d'enregistrer votre offre."),
      }
    );
  }

  if (finished) {
    return (
      <div className="mx-auto flex max-w-[520px] flex-col items-center py-12 text-center">
        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#0F766E]">
          <Check className="h-8 w-8 text-white" strokeWidth={3} />
        </div>
        <h1 className="mt-6 text-[22px] font-bold text-[#1C1B1A]">
          Votre offre de consultation est configurée
        </h1>
        <p className="mt-2 text-[15px] text-[#6B6862]">
          Vous pouvez maintenant enrichir votre profil pour augmenter votre visibilité sur la
          plateforme.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/pro/profil")}
            className="inline-flex items-center gap-2 rounded-[12px] bg-[#0F766E] px-6 py-3 text-[15px] font-semibold text-white hover:bg-[#0C625B]"
          >
            Ajouter une photo de profil
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => navigate("/pro/expertise")}
            className="text-[13.5px] font-medium text-[#0F766E] hover:underline"
          >
            Compléter mes domaines et situations
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-[13.5px] font-medium text-[#6B6862] hover:underline"
          >
            Retour au site
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-[26px] font-bold tracking-[-0.02em] text-[#1C1B1A]">
          Offre de consultation
        </h1>
        <p className="mt-1 text-[14.5px] text-[#6B6862]">
          Définissez les conditions de votre consultation. L'aperçu à droite reflète ce que verront
          vos clients.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-5">
          <Card title="Titre de la consultation" description="Le titre apparaît sur votre profil public et lors de la recherche.">
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
          </Card>

          <Card title="Description" description="Expliquez ce que inclut la consultation et ce que le client doit préparer.">
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
          </Card>

          <Card
            title="Tarif"
            description="Affiché avant toute prise de rendez-vous — sans surprise."
          >
            <div className="relative w-full max-w-[220px]">
              <input
                type="text"
                inputMode="numeric"
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="300"
                aria-label="Tarif en dirhams"
                className="h-[50px] w-full rounded-[12px] border-[1.5px] border-[#E7E5E1] bg-white px-[15px] pr-12 text-[15px] font-medium text-[#1C1B1A] placeholder:text-[#B4AFA6] focus:border-[#0F766E] focus:outline-none focus:ring-[3px] focus:ring-[rgba(20,184,166,0.40)]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] font-semibold text-[#6B6862]">
                DH
              </span>
            </div>
          </Card>

          <Card title="Modalités" description="Sélectionnez au moins une modalité de consultation.">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <ToggleCard
                title="Vidéo"
                icon={Video}
                selected={modalities.has("VIDEO")}
                onToggle={() => toggleModality("VIDEO")}
              />
              <ToggleCard
                title="Audio"
                icon={Phone}
                selected={modalities.has("AUDIO")}
                onToggle={() => toggleModality("AUDIO")}
              />
              <ToggleCard
                title="Chat"
                icon={MessageCircle}
                selected={modalities.has("CHAT")}
                onToggle={() => toggleModality("CHAT")}
              />
            </div>
          </Card>
        </div>

        <div className="lg:sticky lg:top-8 lg:self-start">
          <OfferPreviewCard
            name={previewData.name}
            city={previewData.cityName}
            specialties={previewData.specialtyNames}
            title={title.trim() || null}
            description={description.trim() || null}
            price={priceNumber > 0 ? priceNumber : null}
            modalities={[...modalities]}
            photoUrl={profile?.identity.photoUrl ?? null}
          />
        </div>
      </div>

      <StickyActionBar
        status={
          canFinish
            ? "Prêt à finaliser votre configuration."
            : "Renseignez un titre, une description, un tarif et au moins une modalité."
        }
      >
        <PrimaryButton
          type="button"
          onClick={handleSubmit}
          loading={mutation.isPending}
          disabled={!canFinish || mutation.isPending}
          className="w-auto px-6"
        >
          Terminer la configuration
        </PrimaryButton>
      </StickyActionBar>
    </div>
  );
}
