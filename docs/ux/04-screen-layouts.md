# 04 — Screen Layout Descriptions

> Detailed layout specification for every screen in the Professional Space. Each screen describes page objective, sections, cards, actions, hierarchy, empty states, validation states, and responsive behavior. Features are tagged **[MVP]**, **[Next]**, or **[Future]**.

---

## Screen 1: Registration Page

**Route**: `/inscription/professionnel`

### Page Objective
Create a new professional account or upgrade an existing client account.

### Layout
Centered card on a neutral background. Max-width 440px.

### Sections (top to bottom)

| # | Section | Content | Version |
|---|---|---|---|
| 1 | Brand header | "Chaweer" logo + "Professionnel" badge | MVP |
| 2 | Heading | "Créer votre compte professionnel" + subtitle | MVP |
| 3 | Existing client notice | If user is logged in as CLIENT: notice about account upgrade | MVP |
| 4 | Google button | Social registration | MVP |
| 5 | Divider | "ou" | MVP |
| 6 | Form | Email, Password, Confirm Password | MVP |
| 7 | Submit | "Créer mon compte professionnel" | MVP |
| 8 | Login link | "Vous avez déjà un compte ? Se connecter" | MVP |
| 9 | Client link | "Vous êtes un particulier ? Retour à l'espace grand public" | MVP |
| 10 | Legal | Terms + Privacy acceptance text | MVP |

### Actions
- Register (email/password)
- Register (Google)
- Navigate to login
- Navigate to client registration

### Validation States
- Email: valid email format, required
- Password: min 8 chars, at least 1 letter + 1 digit
- Confirm Password: must match password
- Server errors: displayed in ErrorMessage component

### Responsive
- Desktop: centered card, 440px
- Tablet: centered card, 440px
- Mobile: full width with 16px padding

---

## Screen 2: Dashboard (Tableau de bord)

**Route**: `/pro`

### Page Objective
Cockpit that immediately answers: Where am I? What's missing? What should I do next? What happened?

### Layout
Single-column main content area. Max-width 800px. Centered.

### Sections (top to bottom)

#### Section A: Status Banner **[MVP]**

| Element | Description |
|---|---|
| Status badge | Colored badge: Brouillon (gray) / En vérification (amber) / En ligne (green) / Hors ligne (gray) |
| Contextual message | Changes based on status (see below) |
| Action button | Contextual: "Commencer" / "Voir l'aperçu" / "Voir mon profil public" |

**Status messages**:
- DRAFT (0% complete): "Bienvenue ! Configurez votre profil pour commencer."
- DRAFT (partial): "Votre profil est partiellement configuré. Complétez les sections manquantes."
- DRAFT (100%): "Votre profil est prêt ! Publiez-le pour que les clients puissent vous trouver."
- PENDING_VERIFICATION: "Votre profil est en cours de vérification. Vous serez notifié dès sa mise en ligne."
- PUBLISHED: "Votre profil est en ligne ! Les clients peuvent vous trouver."
- UNPUBLISHED: "Votre profil est hors ligne. Les clients ne peuvent plus vous trouver."

#### Section B: Completion Progress **[MVP]**

| Element | Description |
|---|---|
| Progress bar | Horizontal bar showing overall completion % |
| Percentage | "67% complet" or "Profil complet" |
| Breakdown | Small text listing completed/total sections |

**Completion sections (MVP)**: Identité, Biographie, Coordonnées, Cabinet, Expertise, Offre
**Completion sections (Next)**: + Formation, Expérience, Certifications, Adhésions

#### Section C: Section Status Cards **[MVP]**

Grid of cards (3 columns desktop, 2 tablet, 1 mobile). Each card:

| Element | Description |
|---|---|
| Icon | Section-specific icon |
| Section name | "Profil", "Expertise", "Offres" |
| Status indicator | ✅ complete / ❌ incomplete / ⚠️ partial |
| One-line description | "Identité, bio, contact, cabinet" / "3 spécialités, 4 situations" / "2 offres actives" |
| Click action | Navigates to that section |

#### Section D: Publication Card **[MVP]**

| State | Content |
|---|---|
| Incomplete | "Complétez votre [section] pour publier" + deep links to missing sections. Publish button disabled. |
| Complete, DRAFT | "Votre profil est prêt !" + [Publier mon profil] button |
| PENDING | "En cours de vérification" + disabled state |
| PUBLISHED | "Profil publié le [date]" + [Voir mon profil public] + [Dépublier] |
| UNPUBLISHED | "Profil hors ligne" + [Publier mon profil] |

#### Section E: Quick Actions Card **[MVP]**

A compact, always-visible shortcut panel in the right secondary column (340px). Inspired by Fiverr's "Quick Links". Does not compete with the main content — acts as a persistent navigation aid.

**Layout**: The Dashboard uses a two-column grid: main content (left, 1fr) + secondary column (right, 340px sticky). The secondary column contains Quick Actions, profile completion summary, and future placeholders (notifications, tips). On mobile, the secondary column stacks below the main content (not sticky).

**Card structure**: Standard Chaweer card (`.quick-links`) with a header and a vertical list of clickable rows.

| Element | Description |
|---|---|
| Card title | "Actions rapides" (14px bold) |
| Row | Icon (18px) + label (14px medium) + optional status badge + chevron arrow (16px) |
| Status badge | "Complet" (green) / "Incomplete" (orange) / "Bientôt" (muted) |
| Hover state | Row background becomes subtle gray |
| Click | Full-row click navigation |

**Items**:

| Item | Target | Status | Version |
|---|---|---|---|
| Profil professionnel | /pro/profil | Complete | MVP |
| Expertise | /pro/expertise | Complete | MVP |
| Offres de consultation | /pro/offres | Complete | MVP |
| Aperçu public | /pro/aperçu | — (no badge) | MVP |
| Disponibilités | /pro/disponibilites | Coming Soon | Future |
| Paramètres du compte | /pro/compte | Coming Soon | Future |

**Design constraints**: Uses existing card style, existing colors, existing typography, existing spacing. No new visual language. No descriptions, no paragraphs, no large CTA buttons — just quick navigation.

#### Section F: Profile Completion Summary **[MVP]**

Compact card in the secondary column showing:
- Avatar (40px) + name + professional title + city
- Completion progress bar with percentage
- "Voir le profil public" button

#### Section G: Notifications **[Future]**

Placeholder card in the secondary column.

#### Section H: Tips **[Future]**

Placeholder card in the secondary column with advice for improving profile.

#### Section I: Recent Activity **[Future]**

- Last 5 actions (profile updated, offer created, consultation received, etc.)
- Timestamps
- "Voir tout" link

#### Section J: KPIs / Statistics **[Future]**

- Profile views (this week)
- Consultation requests
- Completed consultations
- Average rating

### Empty State (first visit)
- Status: "Brouillon"
- Completion: 0%
- All section cards: ❌
- Banner: "Bienvenue ! Configurez votre profil pour commencer à recevoir des consultations."
- Single CTA: "Commencer mon profil" → /pro/profil

### Validation States
- N/A (read-only screen). Publish button has pre-condition validation (disabled if incomplete).

### Responsive

| Device | Layout |
|---|---|
| Desktop | App sidebar (240px) + Dashboard two-column: main content (1fr left) + secondary column (340px sticky right). Section cards: 3 columns. |
| Tablet | App sidebar (76px collapsed) + Dashboard two-column: main content (1fr left) + secondary column (340px sticky right). Section cards: 2 columns. |
| Mobile | Bottom tab bar + full width. Dashboard stacks: main content on top + secondary column below (not sticky). Section cards: 1 column. |

---

## Screen 3: Professional Profile

**Route**: `/pro/profil`

### Page Objective
Build a professional identity. Feel like creating a reputation, not filling a form.

### Layout
Two-column on desktop: main content (left, max 640px) + optional sticky mini-preview (right, 280px) [Next]. Single column on tablet/mobile.

### Sections (top to bottom)

#### Section A: Hero **[MVP]**

Full-width banner card at the top of the page.

| Element | Description | Position |
|---|---|---|
| Photo | Circular, 96px desktop / 72px mobile | Left |
| Full name | "Amina El Fassi" — 24px bold | Right of photo |
| Professional title | "Avocate en droit des affaires" — 16px medium, muted | Below name |
| Bar association | "Barreau de Casablanca" — 14px, muted | Below title |
| Verification badge | ✓ icon + "Vérifié" [Next] or empty | Next to name |
| Completion indicator | Circular progress or % badge | Top-right |
| "Voir profil public" button | Secondary button | Top-right |

**Empty state**: Placeholder avatar + "Votre nom" + "Votre titre professionnel" + 0% completion.

#### Section B: Identity Card **[MVP]**

| Mode | Content |
|---|---|
| Read | Photo thumbnail, Full name, Professional title, Bar association. "Modifier" button. |
| Edit | Photo upload slot, First name input, Last name input, Professional title input, Bar association select. "Annuler" + "Enregistrer" buttons. |

**Empty state**: "Ajoutez votre identité professionnelle" + "Compléter" button.

**Validation**: First name (required, 1-100), Last name (required, 1-100), Professional title (optional, max 120), Bar association (optional, must be active).

#### Section C: Biography Card **[MVP]**

| Mode | Content |
|---|---|
| Read | Bio text (formatted paragraphs). "Modifier" button. |
| Edit | Textarea (max 600, char counter). "Annuler" + "Enregistrer". |

**Empty state**: "Ajoutez une biographie pour vous présenter aux clients" + "Ajouter" button.

**Validation**: Max 600 characters.

#### Section D: Professional Contact Card **[MVP]**

| Mode | Content |
|---|---|
| Read | Phone [MVP], WhatsApp [Next], Public email [Next], Website [Next], LinkedIn [Next]. Each as label-value row. "Modifier" button. |
| Edit | Phone input [MVP], WhatsApp input [Next], Email input [Next], Website URL input [Next], LinkedIn URL input [Next]. "Annuler" + "Enregistrer". |

**Empty state**: "Ajoutez vos coordonnées professionnelles" + "Compléter" button.

**Validation**: Phone (max 30), Email (valid email format), Website (valid URL), LinkedIn (valid URL).

#### Section E: Office Card **[MVP]**

| Mode | Content |
|---|---|
| Read | Office name, Address, City. Google Maps link [Next]. "Modifier" button. |
| Edit | Name input, Address input, City select, Google Maps URL input [Next], Lat/Lng inputs [Next]. "Annuler" + "Enregistrer". |

**Empty state**: "Ajoutez les informations de votre cabinet" + "Compléter" button.

**Validation**: Name (max 200), Address (max 255), City (must be active referential).

#### Section F: Education Timeline **[Next]**

| Mode | Content |
|---|---|
| Read | Vertical timeline of entries. Each: degree, institution, years, description. "Modifier" + "Supprimer" per entry. "+ Ajouter une formation" button. |
| Edit (existing) | Inline form within the timeline entry. |
| Add | Inline form at the bottom of the timeline. |

**Empty state**: "Ajoutez votre parcours académique pour renforcer votre crédibilité" + "+ Ajouter une formation" button.

**Validation**: Degree (required, max 200), Institution (required, max 200), Start year (required, 4 digits), End year (optional, ≥ start year or empty for ongoing).

#### Section G: Experience Timeline **[Next]**

Same structure as Education, with fields: Position, Organization, Start year, End year, Current (checkbox), Description.

**Empty state**: "Ajoutez votre expérience professionnelle" + "+ Ajouter une expérience" button.

#### Section H: Certifications Card **[Next]**

| Mode | Content |
|---|---|
| Read | List of certifications. Each: title, issuer, issue year, expiry year, credential ID. Verified badge [Future]. "Modifier" + "Supprimer" per entry. "+ Ajouter une certification" button. |
| Edit | Inline form per entry. |

**Empty state**: "Ajoutez vos certifications et diplômes spécialisés" + "+ Ajouter une certification" button.

**Validation**: Title (required, max 200), Issuer (required, max 200), Issue year (required).

#### Section I: Memberships Card **[Next]**

| Mode | Content |
|---|---|
| Read | List of memberships. Each: organization, role, years. "Modifier" + "Supprimer" per entry. "+ Ajouter une adhésion" button. |
| Edit | Inline form per entry. |

**Empty state**: "Ajoutez vos adhésions professionnelles" + "+ Ajouter une adhésion" button.

**Validation**: Organization (required, max 200), Start year (required).

#### Section J: Languages Card **[MVP]**

| Mode | Content |
|---|---|
| Read | Chips/badges of selected languages. "Modifier" redirects to Expertise page. |

**Note**: Languages are **owned by Expertise**. This card is read-only on the Profile page. It displays the languages selected in Expertise with a "Modifier" link that navigates to `/pro/expertise`.

**Empty state**: "Aucune langue sélectionnée. Rendez-vous dans Expertise pour configurer vos langues de consultation." + link.

### Onboarding CTA **[MVP]**

When the user saves the Identity card during onboarding (completion < 100%), a contextual CTA appears at the bottom of the page: "Continuer vers l'expertise" → `/pro/expertise`. This is non-blocking — the user can ignore it and continue editing other cards.

### Responsive

| Device | Layout |
|---|---|
| Desktop | Hero full-width. Cards in main column (max 640px). Optional mini-preview sticky on right [Next]. |
| Tablet | Hero full-width. Cards full-width. No mini-preview. |
| Mobile | Hero compact (smaller photo, stacked text). Cards full-width, 16px padding. |

---

## Screen 4: Expertise

**Route**: `/pro/expertise`

### Page Objective
Define what the professional does and in which languages they consult.

### Layout
Single column, full width of main content area. Max-width 800px.

### Sections (top to bottom)

#### Section A: Page Header **[MVP]**

- Title: "Mon expertise"
- Subtitle: "Vos clients décrivent un problème concret, pas un domaine du droit. Indiquez les situations que vous traitez pour être proposé au bon moment."

#### Section B: Specializations **[MVP]**

- Section title: "1. Vos spécialités"
- Grid of ToggleCards (3 cols desktop, 2 tablet, 1 mobile)
- Each card: specialization name, selected state, subtitle showing count of selected practice areas (when selected)

**Empty state**: All cards unselected. No special empty state needed — the grid itself is the entry point.

#### Section C: Practice Areas **[MVP]**

- Section title: "2. Situations que vous traitez"
- One grouped panel per selected specialization
- Each panel: specialization name, "X/Y sélectionnées" counter, "Tout sélectionner / désélectionner" link, grid of toggle chips (3 cols desktop, 2 tablet, 1 mobile)

**Empty state** (no specialization selected): Dashed-border placeholder with icon and text: "Sélectionnez au moins une spécialité ci-dessus pour configurer les situations associées."

#### Section D: Languages **[MVP]**

- Section title: "3. Langues de consultation"
- Wrap of Chips (one per language)

**Empty state**: No chips selected. The chips are visible but unselected.

#### Section E: Sticky Action Bar **[MVP]**

Fixed at bottom of viewport.

| Element | Content |
|---|---|
| Status text | "2 spécialités · 4 situations · 3 langues" or "Sélectionnez au moins une spécialité, une situation et une langue." |
| Save button | "Enregistrer" (disabled if validation fails) |
| Onboarding CTA | "Enregistrer et continuer" (during onboarding, navigates to /pro/offres on success) |

### Validation States
- No specialization selected → status: "Sélectionnez au moins une spécialité."
- No practice area selected → status: "Sélectionnez au moins une situation."
- No language selected → status: "Sélectionnez au moins une langue."
- All valid → status shows summary, button enabled

### Responsive

| Device | Layout |
|---|---|
| Desktop | Specialization grid: 3 columns. Practice area chips: 3 columns per panel. Languages: wrap. |
| Tablet | Specialization grid: 2 columns. Practice area chips: 2 columns. |
| Mobile | Specialization grid: 1 column. Practice area chips: 1 column. Languages: wrap. Sticky bar: full width. |

---

## Screen 5: Consultation Offers

**Route**: `/pro/offres`

### Page Objective
Manage multiple consultation offers with a live client-facing preview.

### Layout
Two-column on desktop: offers list (left, flex-1) + sticky live preview (right, 320px). Single column on tablet/mobile (preview moves below).

### Sections

#### Section A: Page Header **[MVP]**

- Title: "Offres de consultation"
- Subtitle: "Définissez les conditions de vos consultations. L'aperçu à droite reflète ce que verront vos clients."

#### Section B: Offer Cards (left column) **[MVP]**

Each offer is a card. Cards are stacked vertically.

| Mode | Content |
|---|---|
| Read | Title, Price + currency, Duration, Modalities (badges), Active toggle. "Modifier" + "Supprimer" buttons. |
| Edit | Title input, Price input (with DH suffix), Duration segmented control, Modalities toggle cards, Active toggle. "Annuler" + "Enregistrer". |

**Offer card states**:
- Active: normal appearance
- Inactive: dimmed/grayed out, "Inactive" badge

**Empty state** (no offers): "Créez votre première offre de consultation pour que les clients puissent vous prendre rendez-vous." + "+ Créer une offre" button.

#### Section C: Add Offer Button **[MVP]**

Below the last offer card: "+ Ajouter une offre" button. Clicking opens an inline new-offer form (same fields as edit mode).

#### Section D: Live Preview (right column, sticky) **[MVP]**

Sticky card that shows a client-facing preview of the offer currently being edited (or the first active offer if none is being edited).

Preview content:
- Professional name, city, specialties (from profile data)
- Photo
- Offer title, price, duration, modalities
- "Prendre rendez-vous" button (disabled in preview)

Updates in real-time as the user edits form fields.

#### Section E: Sticky Action Bar **[MVP]**

| Element | Content |
|---|---|
| Status text | "2 offres actives" or "Créez au moins une offre active pour publier." |
| Save button | Per-card save (inline). No global save needed. |
| Onboarding CTA | "Finaliser la configuration" (during onboarding, navigates to /pro) |

### Validation States
- Price: positive integer, required
- Title: required, max 200
- Duration: one of [15, 30, 45, 60]
- Modalities: at least 1 selected
- At least 1 active offer required for publishing

### Responsive

| Device | Layout |
|---|---|
| Desktop | Two-column: offers (left) + sticky preview (right, 320px). |
| Tablet | Single column. Preview below offers (not sticky). |
| Mobile | Single column. Preview below offers. Cards full width. |

---

## Screen 6: Public Preview

**Route**: `/pro/aperçu`

### Page Objective
Read-only rendering of the public profile exactly as a client sees it. Quality-control tool.

### Layout
Full-page view. No sidebar. No bottom tab bar. Centered content (max-width 720px).

### Sections (top to bottom)

#### Section A: Top Bar **[MVP]**

- "← Retour" button (returns to previous page)
- If unpublished: banner "Aperçu — votre profil n'est pas encore en ligne"

#### Section B: Profile Header **[MVP]**

| Element | Description |
|---|---|
| Photo | Circular, 120px desktop / 80px mobile |
| Full name | 28px bold |
| Professional title | 18px medium, muted |
| Bar association | 16px, muted |
| City | 16px, muted |
| Verification badge | ✓ "Vérifié" [Next] |

**Empty state** (no photo): Placeholder avatar. If name not set: "Votre nom".

#### Section C: Biography **[MVP]**

- Section title: "À propos"
- Bio text in formatted paragraphs
- If empty: section hidden entirely

#### Section D: Expertise **[MVP]**

- Section title: "Expertise"
- Sub-section: Spécialités (badges/chips)
- Sub-section: Situations traitées (grouped by specialization, chips)
- If empty: section hidden

#### Section E: Languages **[MVP]**

- Section title: "Langues de consultation"
- Language chips/badges
- If empty: section hidden

#### Section F: Consultation Offers **[MVP]**

- Section title: "Consultation"
- One card per active offer:
  - Title, Price (DH), Duration, Modalities (badges with icons)
  - "Prendre rendez-vous" button (disabled in preview)
- If no active offers: section hidden

#### Section G: Professional Contact **[MVP]**

- Section title: "Coordonnées"
- Phone [MVP]
- WhatsApp [Next], Public email [Next], Website [Next], LinkedIn [Next]
- Each as icon + value row
- If empty: section hidden

#### Section H: Office **[MVP]**

- Section title: "Cabinet"
- Office name, Address, City
- Google Maps link [Next]
- Map embed [Next]
- If empty: section hidden

#### Section I: Education **[Next]**

- Section title: "Formation"
- Timeline (same visual as Profile page but read-only)
- If empty: section hidden

#### Section J: Experience **[Next]**

- Section title: "Expérience professionnelle"
- Timeline (read-only)
- If empty: section hidden

#### Section K: Certifications **[Next]**

- Section title: "Certifications"
- List of certifications with verified badges [Future]
- If empty: section hidden

#### Section L: Memberships **[Next]**

- Section title: "Adhésions professionnelles"
- List of memberships
- If empty: section hidden

#### Section M: Reviews **[Future]**

- Section title: "Avis"
- Rating summary (average + count)
- List of individual reviews
- If empty: "Aucun avis pour le moment"

#### Section N: Articles **[Future]**

- Section title: "Articles"
- List of published articles
- If empty: section hidden

#### Section O: Awards **[Future]**

- Section title: "Distinctions"
- List of awards
- If empty: section hidden

#### Section P: Video Presentation **[Future]**

- Video player embed
- If empty: section hidden

### Key Principle: Empty sections are hidden, not shown with empty state messages. The public profile only shows what's filled in. This creates a clean, professional appearance.

### Responsive

| Device | Layout |
|---|---|
| Desktop | Centered, max-width 720px. Offers in 2-column grid if multiple. |
| Tablet | Centered, max-width 600px. Offers stacked. |
| Mobile | Full width, 16px padding. Photo smaller (80px). All sections stacked. |

---

## Screen 7: Availability (Placeholder)

**Route**: `/pro/disponibilites`

### Page Objective
Placeholder for future calendar management.

### Layout
Centered content.

### Content
- Icon (calendar)
- "Disponibilités"
- "Cette fonctionnalité sera bientôt disponible. Vous pourrez configurer vos horaires de consultation, vos exceptions et votre temps de préparation."
- No actions.

### Responsive
Same on all devices — centered placeholder.

---

## Screen 8: Account Settings (Placeholder)

**Route**: `/pro/compte`

### Page Objective
Placeholder for future account settings.

### Layout
Centered content.

### Content
- Icon (settings)
- "Paramètres du compte"
- "Cette fonctionnalité sera bientôt disponible. Vous pourrez gérer votre e-mail, votre mot de passe, vos notifications et vos paramètres de confidentialité."
- No actions.

### Responsive
Same on all devices — centered placeholder.

---

## Layout Shell (Shared)

### Desktop (≥ 1024px)

```
┌──────────────────────────────────────────────────┐
│         │                                        │
│ Sidebar │  Main Content Area                     │
│ 240px   │  (scrollable)                          │
│         │                                        │
│ ┌─────┐ │  ┌──────────────────────────────────┐  │
│ │Logo │ │  │ Page Header (title + subtitle)   │  │
│ │+badge│ │  └──────────────────────────────────┘  │
│ └─────┘ │                                        │
│         │  ┌──────────────────────────────────┐  │
│ Nav     │  │ Section / Card                    │  │
│ items   │  │                                    │  │
│         │  └──────────────────────────────────┘  │
│         │                                        │
│         │  ┌──────────────────────────────────┐  │
│         │  │ Section / Card                    │  │
│         │  │                                    │  │
│         │  └──────────────────────────────────┘  │
│         │                                        │
│ ┌─────┐ │  ┌──────────────────────────────────┐  │
│ │User │ │  │ Sticky Action Bar (when needed)  │  │
│ │info │ │  └──────────────────────────────────┘  │
│ │+back│ │                                        │
│ └─────┘ │                                        │
└──────────────────────────────────────────────────┘
```

### Tablet (768px – 1023px)

```
┌──────────────────────────────────────┐
│ Sidebar │  Main Content Area         │
│  76px   │  (scrollable, wider)       │
│ icons   │                            │
│ only    │  Same structure,           │
│         │  2-column grids where      │
│         │  applicable                │
└──────────────────────────────────────┘
```

### Mobile (< 768px)

```
┌──────────────────────┐
│ Top bar (hamburger)  │
├──────────────────────┤
│                      │
│  Main Content        │
│  (full width)        │
│  Single column       │
│  Cards full width    │
│                      │
│                      │
├──────────────────────┤
│ Sticky bar (if any)  │
├──────────────────────┤
│ Bottom tab bar       │
│ [🏠][👤][⚖][📋][⋮]  │
└──────────────────────┘
```

### Public Preview (all devices)

```
┌──────────────────────┐
│ [← Retour]           │
├──────────────────────┤
│                      │
│  Full-page content   │
│  (no sidebar,        │
│   no tab bar)        │
│  Centered, max 720px │
│                      │
└──────────────────────┘
```
