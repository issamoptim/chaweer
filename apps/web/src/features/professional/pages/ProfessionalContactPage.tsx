import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { Card } from "../components/Card";
import { ProInput } from "../components/ProInput";
import { ProSelect } from "../components/ProSelect";
import { ReadField } from "../components/ReadField";
import { EditPageHeader } from "../components/EditPageHeader";
import { EditActionBar } from "../components/EditActionBar";
import { SkeletonPage } from "../components/Skeleton";
import { GoogleMapField, type PlaceResult } from "../components/GoogleMapField";
import { useProfessionalProfile } from "../hooks/useProfessionalProfile";
import { useReferential } from "../hooks/useReferential";
import { useUpdateContact } from "../hooks/useUpdateContact";
import { useUpdateOffice } from "../hooks/useUpdateOffice";
import type { ContactData, OfficeData } from "../types/professional-types";

interface ContactFormState {
  phone: string;
  whatsapp: string;
  publicEmail: string;
  website: string;
  linkedInUrl: string;
}

interface OfficeFormState {
  name: string;
  address: string;
  cityId: string;
  latitude: number | null;
  longitude: number | null;
}

const EMPTY_CONTACT: ContactFormState = {
  phone: "",
  whatsapp: "",
  publicEmail: "",
  website: "",
  linkedInUrl: "",
};

const EMPTY_OFFICE: OfficeFormState = {
  name: "",
  address: "",
  cityId: "",
  latitude: null,
  longitude: null,
};

export function ProfessionalContactPage() {
  const toast = useToast();
  const { data: profile, isLoading } = useProfessionalProfile();
  const { data: referential } = useReferential();
  const contactMutation = useUpdateContact();
  const officeMutation = useUpdateOffice();

  const [isEditing, setIsEditing] = useState(false);
  const [contactForm, setContactForm] = useState<ContactFormState>(EMPTY_CONTACT);
  const [officeForm, setOfficeForm] = useState<OfficeFormState>(EMPTY_OFFICE);
  const [initialContact, setInitialContact] = useState<ContactFormState>(EMPTY_CONTACT);
  const [initialOffice, setInitialOffice] = useState<OfficeFormState>(EMPTY_OFFICE);

  useEffect(() => {
    if (!profile) return;
    const c: ContactData | null = profile.contact;
    const contactState: ContactFormState = {
      phone: c?.phone ?? "",
      whatsapp: c?.whatsapp ?? "",
      publicEmail: c?.publicEmail ?? "",
      website: c?.website ?? "",
      linkedInUrl: c?.linkedInUrl ?? "",
    };
    setContactForm(contactState);
    setInitialContact(contactState);

    const o: OfficeData | null = profile.office;
    const officeState: OfficeFormState = {
      name: o?.name ?? "",
      address: o?.address ?? "",
      cityId: o?.cityId ?? "",
      latitude: o?.latitude ?? null,
      longitude: o?.longitude ?? null,
    };
    setOfficeForm(officeState);
    setInitialOffice(officeState);
  }, [profile]);

  const isDirty =
    JSON.stringify(contactForm) !== JSON.stringify(initialContact) ||
    JSON.stringify(officeForm) !== JSON.stringify(initialOffice);

  const isSaving = contactMutation.isPending || officeMutation.isPending;

  const cityOptions = (referential?.cities ?? []).map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const cityName =
    referential?.cities.find((c) => c.id === (profile?.office?.cityId ?? officeForm.cityId))
      ?.name ?? null;

  function updateContactField(field: keyof ContactFormState, value: string) {
    setContactForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateOfficeField(field: keyof OfficeFormState, value: string) {
    setOfficeForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleCancel() {
    setContactForm(initialContact);
    setOfficeForm(initialOffice);
    setIsEditing(false);
  }

  function handleSave() {
    const promises: Promise<unknown>[] = [];

    if (JSON.stringify(contactForm) !== JSON.stringify(initialContact)) {
      promises.push(
        new Promise((resolve, reject) => {
          contactMutation.mutate(
            {
              phone: contactForm.phone || null,
              whatsapp: contactForm.whatsapp || null,
              publicEmail: contactForm.publicEmail || null,
              website: contactForm.website || null,
              linkedInUrl: contactForm.linkedInUrl || null,
            },
            { onSuccess: resolve, onError: reject }
          );
        })
      );
    }

    if (JSON.stringify(officeForm) !== JSON.stringify(initialOffice)) {
      promises.push(
        new Promise((resolve, reject) => {
          officeMutation.mutate(
            {
              name: officeForm.name || null,
              address: officeForm.address || null,
              cityId: officeForm.cityId || null,
              latitude: officeForm.latitude,
              longitude: officeForm.longitude,
            },
            { onSuccess: resolve, onError: reject }
          );
        })
      );
    }

    if (promises.length === 0) {
      setIsEditing(false);
      return;
    }

    Promise.all(promises)
      .then(() => {
        setInitialContact(contactForm);
        setInitialOffice(officeForm);
        toast.showSuccess("Modifications enregistrées.");
        setIsEditing(false);
      })
      .catch(() => {
        toast.showError("Impossible d'enregistrer vos modifications.");
      });
  }

  if (isLoading) {
    return <SkeletonPage cards={2} />;
  }

  const hasAddress = !!(profile?.office?.address || officeForm.address);

  return (
    <div>
      <EditPageHeader
        title="Contact & cabinet"
        subtitle="Comment vous joindre et où vous trouver. Toutes ces informations sont facultatives."
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
      />

      <div className="flex flex-col gap-5">
        {/* Carte 1 — Coordonnées */}
        <Card title="Coordonnées" description="Vos moyens de contact. Tous les champs sont facultatifs.">
          {isEditing ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ProInput
                label="Téléphone"
                name="phone"
                type="tel"
                value={contactForm.phone}
                onChange={(v) => updateContactField("phone", v)}
                placeholder="+212 6 00 00 00 00"
                disabled={isSaving}
              />
              <ProInput
                label="WhatsApp"
                name="whatsapp"
                type="tel"
                value={contactForm.whatsapp}
                onChange={(v) => updateContactField("whatsapp", v)}
                placeholder="+212 6 00 00 00 00"
                disabled={isSaving}
              />
              <ProInput
                label="E-mail public"
                name="publicEmail"
                type="email"
                value={contactForm.publicEmail}
                onChange={(v) => updateContactField("publicEmail", v)}
                placeholder="contact@exemple.ma"
                disabled={isSaving}
              />
              <ProInput
                label="Site web"
                name="website"
                value={contactForm.website}
                onChange={(v) => updateContactField("website", v)}
                placeholder="https://…"
                disabled={isSaving}
              />
              <ProInput
                label="LinkedIn"
                name="linkedInUrl"
                value={contactForm.linkedInUrl}
                onChange={(v) => updateContactField("linkedInUrl", v)}
                placeholder="https://linkedin.com/in/…"
                disabled={isSaving}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ReadField label="Téléphone" value={profile?.contact?.phone} />
              <ReadField label="WhatsApp" value={profile?.contact?.whatsapp} />
              <ReadField label="E-mail public" value={profile?.contact?.publicEmail} />
              <ReadField label="Site web" value={profile?.contact?.website} />
              <ReadField label="LinkedIn" value={profile?.contact?.linkedInUrl} />
            </div>
          )}
        </Card>

        {/* Carte 2 — Cabinet */}
        <Card title="Cabinet" description="Votre adresse professionnelle.">
          {isEditing ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1fr]">
                <ProInput
                  label="Adresse"
                  name="address"
                  value={officeForm.address}
                  onChange={(v) => updateOfficeField("address", v)}
                  placeholder="Rue, numéro, quartier…"
                  disabled={isSaving}
                />
                <ProSelect
                  label="Ville"
                  name="city"
                  value={officeForm.cityId}
                  options={cityOptions}
                  onChange={(v) => updateOfficeField("cityId", v)}
                  disabled={isSaving}
                />
              </div>
              <p className="text-[12.5px] text-[#9A968E]">
                Recherchez votre adresse sur la carte ou déplacez le marqueur pour positionner votre cabinet.
              </p>
              <GoogleMapField
                latitude={officeForm.latitude}
                longitude={officeForm.longitude}
                address={officeForm.address}
                disabled={isSaving}
                onPlaceSelect={(place: PlaceResult) => {
                  setOfficeForm((prev) => ({
                    ...prev,
                    address: place.address,
                    latitude: place.latitude,
                    longitude: place.longitude,
                  }));
                }}
                onMarkerDrag={(lat, lng) => {
                  setOfficeForm((prev) => ({
                    ...prev,
                    latitude: lat,
                    longitude: lng,
                  }));
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ReadField label="Adresse" value={profile?.office?.address} />
                <ReadField label="Ville" value={cityName} />
              </div>
              {hasAddress ? (
                <GoogleMapField
                  latitude={profile?.office?.latitude ?? null}
                  longitude={profile?.office?.longitude ?? null}
                  address={profile?.office?.address ?? ""}
                  disabled
                  onPlaceSelect={() => {}}
                />
              ) : (
                <div className="relative h-[180px] overflow-hidden rounded-[12px] border border-[#E9E7E3] bg-gradient-to-br from-[#E6F2F0] to-[#F0FAF8]">
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(15,118,110,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(15,118,110,0.08) 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <MapPin className="mx-auto h-7 w-7 text-[#B4AFA6]" />
                    <p className="mt-1 text-[12px] text-[#9A968E]">Aucune adresse renseignée</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      <EditActionBar
        isEditing={isEditing}
        isSaving={isSaving}
        canSave={isDirty}
        onSave={handleSave}
        onCancel={handleCancel}
        status={isDirty ? "Modifications non enregistrées" : undefined}
      />
    </div>
  );
}
