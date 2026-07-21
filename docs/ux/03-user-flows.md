# 03 — User Flows (Wireflows)

> Complete navigation scenarios for the Professional Space. Each flow is tagged with **[MVP]**, **[Next]**, or **[Future]** steps. Flows describe the user's journey, not implementation details.

---

## Flow 1: New Professional Onboarding

### Trigger
User completes registration on `/inscription/professionnel` or upgrades from CLIENT to PROFESSIONAL.

### Flow

```
[Registration success]
    │
    ▼
┌─────────────────────────────────────────┐
│ Dashboard (/pro)                        │
│                                         │
│ Status: Brouillon                       │
│ Completion: 0%                          │
│                                         │
│ ┌───────────┐ ┌───────────┐ ┌────────┐ │
│ │ Profil  ❌│ │ Expertise❌│ │ Offre ❌│ │
│ └───────────┘ └───────────┘ └────────┘ │
│                                         │
│ Banner: "Bienvenue ! Configurez votre   │
│ profil pour commencer à recevoir des    │
│ consultations."                        │
│                                         │
│ CTA: "Commencer mon profil"             │
└──────────────┬──────────────────────────┘
               │ click "Commencer"
               ▼
┌─────────────────────────────────────────┐
│ Profil professionnel (/pro/profil)      │
│                                         │
│ Hero: Photo placeholder + "Votre nom"   │
│       Completion: 0%                    │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Card: Identité                      │ │
│ │  → Edit mode                        │ │
│ │  → Photo upload                     │ │
│ │  → First name, Last name            │ │
│ │  → Professional title [MVP]         │ │
│ │  → Bar association [MVP]            │ │
│ │  → Save                             │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ Card: Biographie                    │ │
│ │  → Edit mode                        │ │
│ │  → Bio textarea (max 600)           │ │
│ │  → Save                             │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ Card: Coordonnées professionnelles  │ │
│ │  → Edit mode                        │ │
│ │  → Phone [MVP]                      │ │
│ │  → Save                             │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ Card: Cabinet                       │ │
│ │  → Edit mode                        │ │
│ │  → Name, Address, City [MVP]        │ │
│ │  → Save                             │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Onboarding CTA: "Continuer vers         │
│ l'expertise" (appears when identity     │
│ is saved)                               │
└──────────────┬──────────────────────────┘
               │ click CTA
               ▼
┌─────────────────────────────────────────┐
│ Expertise (/pro/expertise)              │
│                                         │
│ Section 1: Spécialités                  │
│  → Toggle specialization cards          │
│                                         │
│ Section 2: Situations traitées          │
│  → Appears for selected specializations │
│  → Toggle practice area chips           │
│                                         │
│ Section 3: Langues                      │
│  → Toggle language chips                │
│                                         │
│ Sticky bar: "X spé · Y sit · Z lang"    │
│ CTA: "Enregistrer et continuer"         │
└──────────────┬──────────────────────────┘
               │ click CTA
               ▼
┌─────────────────────────────────────────┐
│ Offres de consultation (/pro/offres)    │
│                                         │
│ Left: Offer card (first offer)          │
│  → Title: "Consultation juridique"      │
│  → Price: __ DH                         │
│  → Duration: [15][30][45][60]           │
│  → Modalities: [Vidéo] [Cabinet]        │
│                                         │
│ Right: Live preview (sticky)            │
│  → Updates in real-time                 │
│                                         │
│ Sticky bar: "Enregistrer"               │
│ CTA: "Finaliser la configuration"       │
└──────────────┬──────────────────────────┘
               │ click CTA
               ▼
┌─────────────────────────────────────────┐
│ Dashboard (/pro)                        │
│                                         │
│ Status: Brouillon                       │
│ Completion: 100% (MVP sections)         │
│                                         │
│ All section cards: ✅                   │
│                                         │
│ Publish action: ENABLED                 │
│ "Votre profil est prêt ! Publiez-le     │
│ pour que les clients puissent vous      │
│ trouver."                               │
│                                         │
│ CTA: "Publier mon profil"               │
└──────────────┬──────────────────────────┘
               │ click "Publier"
               ▼
┌─────────────────────────────────────────┐
│ Confirmation modal                      │
│ "Publier votre profil ?                │
│ Notre équipe vérifiera vos informations │
│ avant la mise en ligne."                │
│ [Annuler] [Publier]                     │
└──────────────┬──────────────────────────┘
               │ confirm
               ▼
┌─────────────────────────────────────────┐
│ Dashboard (/pro)                        │
│                                         │
│ Status: En cours de vérification        │
│ Banner: "Votre profil est en cours de   │
│ vérification. Vous serez notifié dès    │
│ qu'il sera en ligne."                   │
│                                         │
│ Publish button: disabled                │
│ "Voir l'aperçu" still available         │
└─────────────────────────────────────────┘
```

### Key Principles
- **Non-blocking**: User can navigate to any section at any time. The dashboard guides but doesn't force.
- **Card-by-card**: Each card saves independently. No giant form submission.
- **Onboarding CTAs**: Appear contextually when a section is saved, suggesting the next logical step.
- **Completion-driven**: The publish button on the Dashboard is enabled only when MVP pre-conditions are met.

### [Next] Additional Steps
After MVP onboarding, the user is prompted to enrich their profile:
- "Ajoutez votre formation" → Education timeline
- "Ajoutez votre expérience" → Experience timeline
- "Ajoutez vos certifications" → Certifications card

### [Future] Additional Steps
- Availability setup after first publish
- Video presentation upload
- Verified document upload

---

## Flow 2: Editing an Existing Profile

### Trigger
Professional clicks "Profil professionnel" in sidebar.

```
┌─────────────────────────────────────────┐
│ Profil professionnel (/pro/profil)      │
│                                         │
│ Hero: Photo + "Amina El Fassi"          │
│       Title: "Avocate en droit des..."  │
│       Bar: "Barreau de Casablanca"      │
│       Completion: 85%                   │
│       [Voir profil public]              │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Card: Identité (read mode)          │ │
│ │  Photo | Amina El Fassi             │ │
│ │  Title | Barreau de Casablanca      │ │
│ │  [Modifier]                         │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Card: Biographie (read mode)        │ │
│ │  "Avocate passionnée par le..."     │ │
│ │  [Modifier]                         │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Card: Coordonnées (read mode)       │ │
│ │  Phone: +212 6 12 34 56 78          │ │
│ │  [Modifier]                         │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

User clicks "Modifier" on the Biographie card:

```
┌─────────────────────────────────────┐
│ Card: Biographie (edit mode)        │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Textarea                         │ │
│ │ "Avocate passionnée par le..."   │ │
│ │                          247/600 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Annuler]              [Enregistrer]│
└─────────────────────────────────────┘
```

User edits, clicks "Enregistrer":

```
┌─────────────────────────────────────┐
│ Card: Biographie (read mode)        │
│                                     │
│ "Avocate passionnée par le droit    │
│ des affaires et le droit fiscal..." │
│                                     │
│ ✓ Enregistré           [Modifier]   │
└─────────────────────────────────────┘
```

### Key Principles
- **Inline edit**: Card switches to edit mode in place. No page change, no modal.
- **Independent save**: Saving one card doesn't affect others. No "unsaved changes" warnings for other cards.
- **Visual feedback**: Brief "✓ Enregistré" confirmation, then card returns to read mode.
- **Cancel**: Reverts to previous values and returns to read mode.
- **No forced navigation**: User stays on the Profile page. No redirect to next section.

### [Next] Timeline Interactions

```
┌─────────────────────────────────────────┐
│ Card: Formation                         │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ●  Master en Droit des Affaires     │ │
│ │    Université Mohammed V            │ │
│ │    2017 — 2019                      │ │
│ │    [Modifier] [Supprimer]           │ │
│ ├─────────────────────────────────────┤ │
│ │ ●  Licence en Droit                 │ │
│ │    Université Hassan II             │ │
│ │    2014 — 2017                      │ │
│ │    [Modifier] [Supprimer]           │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [+ Ajouter une formation]               │
└─────────────────────────────────────────┘
```

Clicking "+ Ajouter une formation" opens an inline form within the card:

```
┌─────────────────────────────────────────┐
│ Card: Formation                         │
│                                         │
│ (existing entries above)                │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ New entry form (inline)             │ │
│ │  Diplôme: _______________           │ │
│ │  Établissement: ___________         │ │
│ │  Année début: ____  Année fin: ____ │ │
│ │  Description: ___________           │ │
│ │  [Annuler]          [Ajouter]       │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## Flow 3: Viewing the Public Preview

### Trigger
Professional clicks "Voir profil public" from Dashboard, Profile Hero, or Quick Actions.

```
┌─────────────────────────────────────────┐
│ Aperçu public (/pro/aperçu)             │
│                                         │
│ [← Retour au tableau de bord]           │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Profile Header                      │ │
│ │  ┌────┐                             │ │
│ │  │Photo│  Amina El Fassi            │ │
│ │  └────┘  Avocate en droit des...    │ │
│ │           Barreau de Casablanca     │ │
│ │           Casablanca, Maroc         │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ À propos                            │ │
│ │ "Avocate passionnée par le..."      │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Expertise                           │ │
│ │  Spécialités: Droit des affaires... │ │
│ │  Situations: Création d'entreprise… │ │
│ │  Langues: Français, Arabe, Anglais  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
││ Consultation                         │ │
││  ┌────────────────────────────────┐  │ │
││  │ Consultation juridique         │  │ │
││  │ 300 DH · 30 min                │  │ │
││  │ Vidéoconférence                │  │ │
││  │ [Prendre rendez-vous]          │  │ │
││  └────────────────────────────────┘  │ │
│└─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Coordonnées                         │ │
│ │  📞 +212 6 12 34 56 78              │ │
│ │  🏢 Cabinet El Fassi & Associés     │ │
│ │     12 rue de la Liberté            │ │
│ │     Casablanca                      │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Next/Future sections below]            │
│                                         │
│ NO edit controls. NO sidebar.           │
│ Full-page read-only view.               │
└─────────────────────────────────────────┘
```

### Key Principles
- **No sidebar**: The preview is a full-page view. No navigation chrome.
- **No edit controls**: Pure read-only. The professional sees exactly what a client sees.
- **"Retour" button**: Top-left, returns to the previous page (Dashboard or Profile).
- **Same components**: Uses the same card/section components as the public profile shown to clients.
- **Unpublished profiles**: If the profile is not PUBLISHED, a banner at the top says "Aperçu — votre profil n'est pas encore en ligne" so the professional knows this is not visible to clients yet.

### [Next] Additional sections in preview:
- Formation (Education timeline)
- Expérience (Experience timeline)
- Certifications
- Adhésions
- Carte / Localisation (Google Maps embed)

### [Future] Additional sections:
- Avis (Reviews)
- Articles
- Vidéo de présentation
- Récompenses (Awards)
- Badge de vérification

---

## Flow 4: Publishing / Unpublishing

### 4.1 Publishing

### Trigger
Professional is on Dashboard with all MVP sections complete.

```
┌─────────────────────────────────────────┐
│ Dashboard (/pro)                        │
│                                         │
│ Status: Brouillon                       │
│ Completion: 100%                        │
│                                         │
│ All section cards: ✅                   │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Publication card                    │ │
│ │  "Votre profil est prêt !"          │ │
│ │  "Publiez-le pour que les clients   │ │
│ │   puissent vous trouver."           │ │
│ │  [Publier mon profil]               │ │
│ └─────────────────────────────────────┘ │
└──────────────┬──────────────────────────┘
               │ click "Publier"
               ▼
┌─────────────────────────────────────────┐
│ Confirmation modal                      │
│                                         │
│ "Publier votre profil ?"               │
│ "Notre équipe vérifiera vos             │
│ informations avant la mise en ligne.   │
│ Vous serez notifié dès que votre profil │
│ sera actif."                            │
│                                         │
│ [Annuler]              [Publier]        │
└──────────────┬──────────────────────────┘
               │ confirm
               ▼
┌─────────────────────────────────────────┐
│ Dashboard (/pro)                        │
│                                         │
│ Status: En cours de vérification        │
│ Banner: "Profil en cours de vérification│
│ — vous serez notifié à la mise en ligne"│
│                                         │
│ Publish button: hidden                  │
│ Unpublish button: N/A (not published)   │
│ "Voir l'aperçu" still available         │
└─────────────────────────────────────────┘
```

### 4.2 After Admin Approval

```
┌─────────────────────────────────────────┐
│ Dashboard (/pro)                        │
│                                         │
│ Status: En ligne ✓                      │
│ Banner: "Votre profil est en ligne !    │
│ Les clients peuvent maintenant vous     │
│ trouver et prendre rendez-vous."        │
│                                         │
│ Publication card:                       │
│  "Profil publié le 21 juillet 2026"     │
│  [Voir mon profil public]               │
│  [Dépublier]                            │
└─────────────────────────────────────────┘
```

### 4.3 Unpublishing

```
┌─────────────────────────────────────────┐
│ Dashboard (/pro)                        │
│                                         │
│ Status: En ligne ✓                      │
│                                         │
│ User clicks [Dépublier]                 │
└──────────────┬──────────────────────────┘
               ▼
┌─────────────────────────────────────────┐
│ Confirmation modal                      │
│                                         │
│ "Dépublier votre profil ?"             │
│ "Votre profil ne sera plus visible par  │
│ les clients. Vous pourrez le republier  │
│ à tout moment."                         │
│                                         │
│ [Annuler]          [Dépublier]          │
└──────────────┬──────────────────────────┘
               │ confirm
               ▼
┌─────────────────────────────────────────┐
│ Dashboard (/pro)                        │
│                                         │
│ Status: Hors ligne                      │
│ Banner: "Votre profil est hors ligne.   │
│ Les clients ne peuvent plus vous trouver."│
│                                         │
│ Publication card:                       │
│  [Publier mon profil]                   │
└─────────────────────────────────────────┘
```

### Key Principles
- **Publishing is a Dashboard action**: No separate page. Modal confirmation.
- **Status is always visible**: The Dashboard banner always shows the current status.
- **Unpublish is reversible**: The professional can republish at any time.
- **Verification step**: Publishing goes through admin review (PENDING_VERIFICATION) before going live (PUBLISHED).
- **Pre-condition check**: If MVP sections are incomplete, the publish button is disabled with a message listing what's missing.

### Incomplete Profile State

```
┌─────────────────────────────────────────┐
│ Dashboard (/pro)                        │
│                                         │
│ Status: Brouillon                       │
│ Completion: 67%                         │
│                                         │
│ ┌───────────┐ ┌───────────┐ ┌────────┐ │
│ │ Profil  ✅│ │ Expertise❌│ │ Offre ❌│ │
│ └───────────┘ └───────────┘ └────────┘ │
│                                         │
│ Publication card:                       │
│  "Complétez votre expertise et votre    │
│  offre pour publier votre profil."      │
│  [Configurer l'expertise]               │
│  [Configurer l'offre]                   │
│  Publish button: DISABLED               │
└─────────────────────────────────────────┘
```

---

## Flow 5: Managing Consultation Offers

### Trigger
Professional clicks "Offres de consultation" in sidebar.

### 5.1 Viewing Multiple Offers [MVP]

```
┌─────────────────────────────────────────────┐
│ Offres de consultation (/pro/offres)        │
│                                             │
│ Left column (form)          Right column    │
│                             (sticky preview)│
│                                             │
│ ┌─────────────────────┐    ┌──────────────┐│
│ │ Offer #1            │    │ Aperçu       ││
│ │ Title: Consult...   │    │              ││
│ │ Price: 300 DH       │    │ Amina El     ││
│ │ Duration: 30 min    │    │ Fassi        ││
│ │ Modalities: [Vidéo] │    │ Avocate...   ││
│ │ Active: ✓           │    │              ││
│ │ [Modifier] [Suppr.] │    │ 300 DH       ││
│ └─────────────────────┘    │ 30 min       ││
│                             │ Vidéo        ││
│ ┌─────────────────────┐    │              ││
│ │ Offer #2            │    │ [Prendre RDV]││
│ │ Title: Suivi de...  │    └──────────────┘│
│ │ Price: 150 DH       │                     │
│ │ Duration: 15 min    │                     │
│ │ Modalities: [Vidéo] │                     │
│ │ Active: ✓           │                     │
│ │ [Modifier] [Suppr.] │                     │
│ └─────────────────────┘                     │
│                                             │
│ [+ Ajouter une offre]                       │
│                                             │
│ Sticky bar: "2 offres actives"              │
└─────────────────────────────────────────────┘
```

### 5.2 Adding a New Offer [MVP]

```
User clicks [+ Ajouter une offre]

┌─────────────────────────────────────┐
│ New offer card (edit mode)          │
│                                     │
│ Title: _______________              │
│ Price: ___ DH                       │
│ Duration: [15][30][45][60]          │
│ Modalities: [Vidéo] [Cabinet]       │
│                                     │
│ [Annuler]              [Créer]      │
└─────────────────────────────────────┘
```

### 5.3 Editing an Offer [MVP]

```
User clicks [Modifier] on an offer

┌─────────────────────────────────────┐
│ Offer #1 (edit mode)                │
│                                     │
│ Title: Consultation juridique       │
│ Price: 300 DH                       │
│ Duration: [15][●30][45][60]         │
│ Modalities: [●Vidéo] [Cabinet]      │
│ Active: [toggle]                    │
│                                     │
│ [Annuler]              [Enregistrer]│
└─────────────────────────────────────┘
```

### 5.4 Activating/Deactivating [MVP]

Each offer has an active toggle. Inactive offers are not shown to clients but remain in the professional's dashboard.

### Key Principles
- **1:N support**: Multiple offers. Each is an independent card.
- **Live preview**: The right-column preview updates as the user edits. It shows the first active offer (or the one being edited).
- **Active toggle**: Offers can be deactivated without deletion. Deactivated offers are dimmed in the list.
- **Delete with confirmation**: Deleting an offer requires a confirmation step.
- **At least one active offer**: Required for publishing. If all offers are inactive, the Dashboard shows a warning.

### [Next] Additional fields:
- `description` field per offer
- Offer ordering (drag to reorder)

### [Future] Additional features:
- Different offer types (initial consultation, follow-up, document review)
- Custom durations (beyond 15/30/45/60)
- Group consultations

---

## Flow 6: Updating Expertise

### Trigger
Professional clicks "Expertise" in sidebar.

```
┌─────────────────────────────────────────┐
│ Expertise (/pro/expertise)              │
│                                         │
│ Section 1: Vos spécialités              │
│ ┌────────┐ ┌────────┐ ┌────────┐       │
│ │Droit des│ │Droit    │ │Droit    │     │
│ │affaires │ │fiscal   │ │pénal    │     │
│ │  ✓      │ │  ✓      │ │         │     │
│ └────────┘ └────────┘ └────────┘       │
│                                         │
│ Section 2: Situations traitées          │
│ ┌─────────────────────────────────────┐ │
│ │ Droit des affaires    3/5  [Tout]   │ │
│ │ [✓ Création d'entreprise]           │ │
│ │ [✓ Fusions et acquisitions]         │ │
│ │ [✓ Contrats commerciaux]            │ │
│ │ [  Propriété intellectuelle]        │ │
│ │ [  Litiges commerciaux]             │ │
│ ├─────────────────────────────────────┤ │
│ │ Droit fiscal           1/3  [Tout]  │ │
│ │ [✓ Optimisation fiscale]            │ │
│ │ [  Contrôle fiscal]                 │ │
│ │ [  Contentieux fiscal]              │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Section 3: Langues de consultation      │
│ [✓ Français] [✓ Arabe] [✓ Anglais]      │
│ [  Espagnol] [  Allemand]               │
│                                         │
│ Sticky bar: "2 spé · 4 sit · 3 lang"    │
│ [Enregistrer]                           │
└─────────────────────────────────────────┘
```

### Interaction Details

1. **Toggle a specialization**: Clicking a specialization card selects/deselects it.
   - Selecting: Card highlights, practice areas appear below.
   - Deselecting: Card unhighlights, its practice areas are removed from selection (cascade).

2. **Toggle practice areas**: Clicking a practice area chip toggles it.
   - "Tout sélectionner / désélectionner" per specialization group.
   - Counter shows "X/Y sélectionnées".

3. **Toggle languages**: Clicking a language chip toggles it.

4. **Save**: All three (specializations, practice areas, languages) are saved together in one PUT request.

### Validation
- At least 1 specialization required
- At least 1 practice area required (must belong to a selected specialization)
- At least 1 language required
- If validation fails, sticky bar shows what's missing and save button is disabled

### Key Principles
- **Cascade rule**: Deselecting a specialization removes all its practice areas.
- **Orphan prevention**: Practice areas must belong to a selected specialization (enforced by API).
- **Single save**: All expertise data saved together (existing behavior preserved).
- **Visual feedback**: Sticky bar shows a live summary of selections.

---

## Flow 7: Adding Education / Experience / Certifications [Next]

### 7.1 Adding Education

### Trigger
Professional is on Profile page, scrolls to Formation card.

```
┌─────────────────────────────────────────┐
│ Card: Formation                         │
│                                         │
│ Empty state:                            │
│ "Ajoutez votre parcours académique      │
│ pour renforcer votre crédibilité."      │
│ [+ Ajouter une formation]               │
└──────────────┬──────────────────────────┘
               │ click "+"
               ▼
┌─────────────────────────────────────────┐
│ Card: Formation                         │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Inline form                         │ │
│ │  Diplôme*: ________________         │ │
│ │  Établissement*: ___________        │ │
│ │  Année début*: ____                 │ │
│ │  Année fin: ____ (vide = en cours)  │ │
│ │  Description: ______________        │ │
│ │  [Annuler]          [Ajouter]       │ │
│ └─────────────────────────────────────┘ │
└──────────────┬──────────────────────────┘
               │ click "Ajouter"
               ▼
┌─────────────────────────────────────────┐
│ Card: Formation                         │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ●  Master en Droit des Affaires     │ │
│ │    Université Mohammed V            │ │
│ │    2017 — 2019                      │ │
│ │    [Modifier] [Supprimer]           │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [+ Ajouter une formation]               │
└─────────────────────────────────────────┘
```

### 7.2 Adding Experience

Same pattern as Education, but with fields:
- Poste* (position)
- Organisation* (organization)
- Année début* (startYear)
- Année fin (endYear, empty = current)
- Poste actuel (current checkbox)
- Description

### 7.3 Adding Certifications

Same pattern, with fields:
- Titre* (title)
- Organisme émetteur* (issuer)
- Année d'obtention* (issueYear)
- Année d'expiration (expiryYear)
- Identifiant de credential (credentialId)

### Key Principles
- **Timeline visual**: Education and Experience entries are displayed as timeline blocks (vertical list with dot markers), not table rows.
- **Inline forms**: Adding/editing happens within the card. No modals, no page changes.
- **Independent lifecycle**: Each entry can be edited or deleted independently.
- **Ordering**: Entries are ordered by `order` field (most recent first by default).
- **Empty states**: Each card has a contextual empty state with a clear CTA.
- **Validation**: Required fields marked with *. Inline validation on blur.

### [Future] Certifications:
- Verified badge when `verified = true`
- Link to verify credential with issuer

---

## Flow 8: Account Settings [Future]

### Trigger
Professional clicks "Paramètres du compte" in sidebar.

### Planned Sections (not built yet)

```
┌─────────────────────────────────────────┐
│ Paramètres du compte (/pro/compte)      │
│                                         │
│ Placeholder: "Bientôt disponible"       │
│                                         │
│ [Future sections:]                      │
│ - E-mail et mot de passe                │
│ - Notifications (email, push)           │
│ - Confidentialité                        │
│ - Suppression du compte                 │
└─────────────────────────────────────────┘
```

---

## Flow 9: Mobile Navigation [MVP]

### Trigger
Professional accesses the space from a mobile device.

```
┌──────────────────────┐
│ ☰  Chaweer Pro       │  ← Top bar with hamburger
├──────────────────────┤
│                      │
│  Page content        │
│  (full width)        │
│  Cards stacked       │
│  vertically          │
│                      │
│                      │
├──────────────────────┤
│ [🏠][👤][⚖][📋][⋮]  │  ← Bottom tab bar
└──────────────────────┘
```

### Mobile-specific behaviors
- **Sidebar**: Hidden. Hamburger opens a slide-in drawer.
- **Bottom tab bar**: 4 main items (Dashboard, Profil, Expertise, Offres) + "Plus" (Availability, Settings, Logout).
- **Cards**: Full width, single column.
- **Sticky action bar**: Full width, button stretches.
- **Live preview (Offers)**: Moves below the form cards (not sticky).
- **Public Preview**: Full screen, "Retour" button in top bar.
- **Hero section**: Compact — photo smaller, text wraps.
- **Timeline**: Single column, same as desktop.
- **Expertise grids**: Single column for specialization cards. Practice area chips wrap.

### Tablet behaviors
- **Sidebar**: Auto-collapsed to icons (76px). Expandable via hamburger.
- **Content**: Wider, 2-column grids where applicable.
- **Preview**: Stacked below form (not sticky).
