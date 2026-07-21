# 05 — Component Inventory & Specification

> Complete inventory of reusable UI components for the Professional Space, classified by level. Each component is specified with purpose, props, states, variants, responsive behavior, usage, and future extensions. This document is the foundation of the Design System.

---

## Classification Levels

| Level | Description |
|---|---|
| **Foundation** | Design tokens: colors, typography, spacing, icons |
| **Layout** | Structural containers that arrange content |
| **Navigation** | Components for moving between pages/sections |
| **Cards** | Content containers with read/edit lifecycle |
| **Inputs** | Form field components |
| **Selection** | Toggle/pick components for choosing options |
| **Status** | Indicators for completion, validation, state |
| **Timeline** | Specialized components for education/experience |
| **Preview** | Components for the public profile rendering |
| **Future** | Components designed but not yet built |

---

## Foundation

### F-01: Color Tokens

| Token | Value (prototype) | Usage |
|---|---|---|
| `--color-bg` | #FFFFFF | Page background |
| `--color-bg-subtle` | #F7F7F5 | Subtle backgrounds (sidebar, sections) |
| `--color-surface` | #FFFFFF | Card backgrounds |
| `--color-border` | #E9E7E3 | Borders, dividers |
| `--color-border-strong` | #D9D6D0 | Strong borders (dashed placeholders) |
| `--color-text` | #1C1B1A | Primary text |
| `--color-text-secondary` | #6B6862 | Secondary text |
| `--color-text-muted` | #9A968E | Muted/placeholder text |
| `--color-text-disabled` | #B4AFA6 | Disabled text |
| `--color-primary` | #0F766E | Primary actions, selected states |
| `--color-primary-bg` | #E6F2F0 | Primary background tint |
| `--color-primary-ring` | rgba(20,184,166,0.40) | Focus rings |
| `--color-success` | #0F766E | Success indicators |
| `--color-warning` | #B45309 | Warning/pending states |
| `--color-error` | #B91C1C | Error states |
| `--color-overlay` | rgba(0,0,0,0.4) | Modal overlay |

> **Note**: These are the prototype colors. The final design system will define the full palette. The wireframe prototype uses grayscale only.

### F-02: Typography Scale

| Token | Size | Weight | Usage |
|---|---|---|---|
| `--text-hero` | 28px | 700 | Hero name on Profile |
| `--text-h1` | 26px | 700 | Page titles |
| `--text-h2` | 18px | 700 | Section titles |
| `--text-h3` | 16px | 700 | Card titles |
| `--text-body` | 15px | 400 | Body text |
| `--text-body-sm` | 14px | 400 | Secondary body |
| `--text-label` | 14px | 500 | Input labels |
| `--text-caption` | 13px | 400 | Captions, descriptions |
| `--text-micro` | 12px | 600 | Badges, micro labels |
| `--text-tiny` | 11px | 600 | "Bientôt" badge |

### F-03: Spacing System

| Token | Value | Usage |
|---|---|---|
| `--space-xs` | 4px | Tight gaps within components |
| `--space-sm` | 8px | Small gaps between elements |
| `--space-md` | 12px | Medium gaps |
| `--space-lg` | 16px | Standard padding/gap |
| `--space-xl` | 24px | Section gaps |
| `--space-2xl` | 32px | Large section gaps |
| `--space-3xl` | 48px | Page-level vertical spacing |

### F-04: Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 8px | Small elements (chips, badges) |
| `--radius-md` | 10px | Buttons, inputs |
| `--radius-lg` | 12px | Cards |
| `--radius-xl` | 14px | Large cards, panels |
| `--radius-2xl` | 20px | Hero, modals |
| `--radius-full` | 9999px | Circular elements (avatar, badges) |

### F-05: Icon System

Icons from `lucide-react` (or equivalent). Standardized at 18px for nav, 16px for inline, 24px for empty states.

| Icon | Usage |
|---|---|
| LayoutDashboard | Dashboard nav |
| UserRound | Profile nav |
| Scale | Expertise nav |
| Video | Offers nav |
| CalendarDays | Availability nav |
| Settings | Account settings nav |
| Check | Completed, success |
| ArrowRight | Onboarding CTA |
| ArrowLeft | Back navigation |
| ChevronLeft | Sidebar collapse |
| Plus | Add entry |
| Pencil | Edit action |
| Trash2 | Delete action |
| MapPin | Office, location |
| Phone | Contact phone |
| Globe | Website |
| Linkedin | LinkedIn |
| Mail | Email |
| Video | Video consultation |
| Building | Office/cabinet |
| GraduationCap | Education |
| Briefcase | Experience |
| Award | Certifications, awards |
| Layers | Empty state (expertise) |
| Rocket | Publish action |
| Eye | Preview action |
| ShieldCheck | Verification badge |
| Star | Reviews [Future] |

---

## Layout

### L-01: AppShell

| Attribute | Value |
|---|---|
| **Purpose** | Root container: sidebar + main content area |
| **Props** | `sidebarCollapsed`, `onToggleSidebar`, `children` |
| **States** | Desktop (sidebar visible), Tablet (sidebar collapsed), Mobile (sidebar hidden, bottom tab bar) |
| **Usage** | All authenticated Professional Space pages except Public Preview |
| **Future** | Notification badge on sidebar items |

### L-02: MainContent

| Attribute | Value |
|---|---|
| **Purpose** | Scrollable main content area within AppShell |
| **Props** | `maxWidth` (default 800px), `children` |
| **States** | Default |
| **Usage** | Inside AppShell, wraps page content |
| **Responsive** | Full width on mobile, max-width on desktop |

### L-03: StickyActionBar

| Attribute | Value |
|---|---|
| **Purpose** | Fixed bottom bar with status text + primary action |
| **Props** | `status` (string), `saved` (boolean, optional), `children` (action buttons) |
| **States** | Default, saved (shows ✓), unsaved (shows warning text) |
| **Usage** | Expertise page, Offers page, Profile page (during onboarding) |
| **Responsive** | Full width on all devices. Fixed to bottom of viewport. |

### L-04: PageHeader

| Attribute | Value |
|---|---|
| **Purpose** | Page title + subtitle at the top of a page |
| **Props** | `title`, `subtitle` |
| **States** | Default |
| **Usage** | Expertise, Offers pages |
| **Responsive** | Same on all devices. Title scales down on mobile. |

### L-05: ResponsiveGrid

| Attribute | Value |
|---|---|
| **Purpose** | CSS Grid container with responsive column counts |
| **Props** | `columns` ({ desktop, tablet, mobile }), `gap` (default 16px), `children` |
| **States** | Default |
| **Usage** | Specialization cards, practice area chips, dashboard section cards |
| **Responsive** | Auto-adjusts columns based on breakpoint |

---

## Navigation

### N-01: Sidebar

| Attribute | Value |
|---|---|
| **Purpose** | Vertical navigation with collapsible state |
| **Props** | `collapsed`, `onToggle`, `activeRoute`, `navItems`, `secondaryNavItems`, `user`, `onLogout` |
| **States** | Expanded (240px), Collapsed (76px, icons only) |
| **Sections** | Brand header, Primary nav, Secondary nav (separator), User footer |
| **Usage** | Desktop + Tablet (always visible, collapsible) |
| **Responsive** | Hidden on mobile (replaced by BottomTabBar + drawer) |
| **Future** | Notification badges, custom ordering |

### N-02: BottomTabBar

| Attribute | Value |
|---|---|
| **Purpose** | Mobile bottom navigation |
| **Props** | `activeRoute`, `items` (max 5) |
| **States** | Default, active item highlighted |
| **Usage** | Mobile only (< 768px) |
| **Items** | Dashboard, Profil, Expertise, Offres, Plus (overflow) |
| **Future** | Badge counts for notifications |

### N-03: MobileDrawer

| Attribute | Value |
|---|---|
| **Purpose** | Slide-in navigation drawer for mobile |
| **Props** | `open`, `onClose`, `navItems`, `user` |
| **States** | Open (slide from left), Closed |
| **Usage** | Mobile, opened via hamburger in top bar |
| **Future** | — |

### N-04: NavLink

| Attribute | Value |
|---|---|
| **Purpose** | Single navigation item with active state |
| **Props** | `to`, `label`, `icon`, `soon` (boolean), `badge` (optional) |
| **States** | Default, Active (highlighted), Disabled/Soon (grayed + "Bientôt" badge) |
| **Usage** | Inside Sidebar, MobileDrawer |
| **Future** | — |

---

## Cards

### C-01: Card

| Attribute | Value |
|---|---|
| **Purpose** | Generic content container with title, description, and action slot |
| **Props** | `title`, `description`, `children`, `action` (optional, e.g. "Modifier" button) |
| **States** | Default |
| **Usage** | Base for all card variants. Used directly on Offers page, Dashboard. |
| **Future** | — |

### C-02: EditableCard

| Attribute | Value |
|---|---|
| **Purpose** | Card with view/edit/save lifecycle |
| **Props** | `title`, `description`, `isEditing`, `onEdit`, `onSave`, `onCancel`, `readContent`, `editContent`, `saveState` (idle/saving/saved/error) |
| **States** | Read mode, Edit mode, Saving (spinner), Saved (✓ confirmation), Error (error message) |
| **Transitions** | Read → (click "Modifier") → Edit → (click "Enregistrer") → Saving → Saved → Read. Edit → (click "Annuler") → Read. |
| **Usage** | Identity, Biography, Contact, Office cards on Profile page |
| **Responsive** | Full width on all devices. Internal layout adapts (inputs stack on mobile). |

### C-03: IdentityCard

| Attribute | Value |
|---|---|
| **Purpose** | Display/edit professional identity (photo, name, title, bar) |
| **Extends** | EditableCard |
| **Read mode** | Photo thumbnail + name + title + bar association name |
| **Edit mode** | ImageUploadSlot + TextInput (firstName) + TextInput (lastName) + TextInput (professionalTitle) + Select (barAssociation) |
| **Empty state** | Placeholder avatar + "Ajoutez votre identité professionnelle" + "Compléter" button |
| **Validation** | firstName (required), lastName (required), professionalTitle (max 120) |
| **Usage** | Profile page |
| **Future** | Verification badge overlay |

### C-04: BiographyCard

| Attribute | Value |
|---|---|
| **Purpose** | Display/edit biography text |
| **Extends** | EditableCard |
| **Read mode** | Formatted bio text (paragraphs) |
| **Edit mode** | TextArea (max 600, char counter) |
| **Empty state** | "Ajoutez une biographie pour vous présenter aux clients" + "Ajouter" button |
| **Validation** | Max 600 characters |
| **Usage** | Profile page, Public Preview (read-only) |

### C-05: ContactCard

| Attribute | Value |
|---|---|
| **Purpose** | Display/edit professional contact info |
| **Extends** | EditableCard |
| **Read mode** | Label-value rows: Phone [MVP], WhatsApp [Next], Email [Next], Website [Next], LinkedIn [Next] |
| **Edit mode** | TextInput fields for each |
| **Empty state** | "Ajoutez vos coordonnées professionnelles" + "Compléter" button |
| **Validation** | Phone (max 30), Email (email format), Website (URL), LinkedIn (URL) |
| **Usage** | Profile page, Public Preview (read-only) |

### C-06: OfficeCard

| Attribute | Value |
|---|---|
| **Purpose** | Display/edit office/cabinet info |
| **Extends** | EditableCard |
| **Read mode** | Office name, address, city name, Google Maps link [Next] |
| **Edit mode** | TextInput (name), TextInput (address), Select (city), UrlInput (googleMaps) [Next], NumberInput (lat) [Next], NumberInput (lng) [Next] |
| **Empty state** | "Ajoutez les informations de votre cabinet" + "Compléter" button |
| **Validation** | Name (max 200), Address (max 255), City (active referential) |
| **Usage** | Profile page, Public Preview (read-only) |
| **Future** | Map embed component |

### C-07: EducationTimeline

| Attribute | Value |
|---|---|
| **Purpose** | Display education entries as a vertical timeline |
| **Props** | `entries` (Education[]), `onAdd`, `onEdit`, `onDelete` |
| **Read mode** | Vertical list of TimelineItem components with dot markers, connecting line |
| **Edit mode** | Inline form within a TimelineItem |
| **Add mode** | Inline form at the bottom of the timeline |
| **Empty state** | "Ajoutez votre parcours académique pour renforcer votre crédibilité" + "+ Ajouter une formation" button |
| **Usage** | Profile page [Next], Public Preview (read-only) [Next] |
| **Version** | Next |

### C-08: ExperienceTimeline

| Attribute | Value |
|---|---|
| **Purpose** | Display professional experience as a vertical timeline |
| **Props** | `entries` (ProfessionalExperience[]), `onAdd`, `onEdit`, `onDelete` |
| **Same structure as EducationTimeline** with experience fields |
| **Empty state** | "Ajoutez votre expérience professionnelle" + "+ Ajouter une expérience" button |
| **Usage** | Profile page [Next], Public Preview (read-only) [Next] |
| **Version** | Next |

### C-09: CertificationsCard

| Attribute | Value |
|---|---|
| **Purpose** | Display certifications as a list |
| **Props** | `entries` (Certification[]), `onAdd`, `onEdit`, `onDelete` |
| **Read mode** | List of certifications: title, issuer, years, credential ID, verified badge [Future] |
| **Edit mode** | Inline form per entry |
| **Add mode** | Inline form at bottom |
| **Empty state** | "Ajoutez vos certifications et diplômes spécialisés" + "+ Ajouter une certification" button |
| **Usage** | Profile page [Next], Public Preview (read-only) [Next] |
| **Version** | Next |

### C-10: MembershipsCard

| Attribute | Value |
|---|---|
| **Purpose** | Display professional memberships as a list |
| **Props** | `entries` (ProfessionalMembership[]), `onAdd`, `onEdit`, `onDelete` |
| **Read mode** | List: organization, role, years |
| **Empty state** | "Ajoutez vos adhésions professionnelles" + "+ Ajouter une adhésion" button |
| **Usage** | Profile page [Next], Public Preview (read-only) [Next] |
| **Version** | Next |

### C-11: LanguagesCard

| Attribute | Value |
|---|---|
| **Purpose** | Read-only display of selected languages on Profile page |
| **Props** | `languages` (string[]), `onEdit` (navigates to Expertise) |
| **Read mode** | Chips/badges of language names + "Modifier" link |
| **Empty state** | "Aucune langue sélectionnée. Configurez vos langues dans Expertise." + link |
| **Usage** | Profile page (read-only — write owner is Expertise) |
| **Note** | This card is always read-only on the Profile page. Editing happens in Expertise. |

### C-12: OfferCard

| Attribute | Value |
|---|---|
| **Purpose** | Display/edit a single consultation offer |
| **Extends** | EditableCard |
| **Read mode** | Title, Price (DH), Duration, Modalities (badges), Active toggle |
| **Edit mode** | TextInput (title), TextInput (price, numeric), SegmentedControl (duration), ToggleCards (modalities), ToggleSwitch (active) |
| **Empty state** | N/A (card only exists when there's an offer) |
| **Validation** | Title (required, max 200), Price (positive int), Duration (15/30/45/60), Modalities (min 1) |
| **Usage** | Offers page |
| **Future** | Description field [Next], offer type categorization [Future] |

### C-13: DashboardSectionCard

| Attribute | Value |
|---|---|
| **Purpose** | Clickable card on Dashboard showing a section's completion status |
| **Props** | `title`, `description`, `status` (complete/incomplete/partial), `to` (route), `icon` |
| **States** | Complete (✅ green check), Incomplete (❌ gray), Partial (⚠️ amber) |
| **Usage** | Dashboard |
| **Responsive** | Part of ResponsiveGrid (3/2/1 columns) |

### C-14: PublicationCard

| Attribute | Value |
|---|---|
| **Purpose** | Dashboard card for publish/unpublish action |
| **Props** | `status`, `completion`, `onPublish`, `onUnpublish`, `onPreview` |
| **States** | Incomplete (disabled + missing sections), Ready (publish button), Pending (disabled), Published (preview + unpublish), Unpublished (republish) |
| **Usage** | Dashboard |

### C-15: QuickLinks

| Attribute | Value |
|---|---|
| **Purpose** | Compact, always-visible shortcut panel for the Dashboard. Inspired by Fiverr's "Quick Links". |
| **Props** | `items` ({ icon, label, to, status?, soon? }[]) |
| **Status values** | `complete` (green badge), `incomplete` (orange badge), `undefined` (no badge) |
| **Structure** | Card with header ("Actions rapides") + vertical list of clickable rows |
| **Row** | Icon (18px) + label (14px medium) + optional status badge + chevron (16px) |
| **States** | Default, Hover (subtle bg), Soon/disabled (muted text, muted icon, "Bientôt" badge) |
| **Usage** | Dashboard — right secondary column (340px sticky) |
| **Responsive** | Sticky on desktop/tablet, stacks below main content on mobile (not sticky) |
| **Design** | Uses existing card style, colors, typography, spacing — no new visual language |

---

## Inputs

### I-01: TextInput

| Attribute | Value |
|---|---|
| **Purpose** | Standard text input with label |
| **Props** | `label`, `name`, `value`, `onChange`, `placeholder`, `error`, `required`, `disabled`, `type`, `autoComplete` |
| **States** | Default, Focus (ring), Error (red border + message), Disabled |
| **Usage** | Identity, Contact, Office, Education, Experience, Certification, Membership, Offer cards |

### I-02: TextArea

| Attribute | Value |
|---|---|
| **Purpose** | Multi-line text input with char counter |
| **Props** | `label`, `name`, `value`, `onChange`, `placeholder`, `maxLength`, `disabled` |
| **States** | Default, Focus, Error, Disabled |
| **Features** | Live character counter "247/600" |
| **Usage** | Biography card, Offer description [Next], Education/Experience description [Next] |

### I-03: Select

| Attribute | Value |
|---|---|
| **Purpose** | Dropdown select with label |
| **Props** | `label`, `name`, `value`, `options` ({value, label}[]), `onChange`, `placeholder`, `disabled` |
| **States** | Default, Focus, Error, Disabled |
| **Usage** | Identity (bar association), Office (city) |

### I-04: ImageUploadSlot

| Attribute | Value |
|---|---|
| **Purpose** | Circular photo upload with preview |
| **Props** | `value` (url or null), `onUpload` (file → promise), `onChange`, `disabled` |
| **States** | Empty (placeholder + "Ajouter une photo"), Loading (spinner), Filled (photo preview + "Changer"), Error |
| **Features** | Circular crop preview, drag-and-drop [Future] |
| **Usage** | Identity card, Hero |

### I-05: UrlInput

| Attribute | Value |
|---|---|
| **Purpose** | URL input with validation |
| **Props** | `label`, `name`, `value`, `onChange`, `placeholder`, `error`, `disabled` |
| **States** | Default, Focus, Error (invalid URL), Disabled |
| **Usage** | Contact (website, LinkedIn) [Next], Office (googleMapsUrl) [Next] |

---

## Selection

### S-01: ToggleCard

| Attribute | Value |
|---|---|
| **Purpose** | Selectable card with icon, title, subtitle |
| **Props** | `title`, `subtitle`, `icon`, `selected`, `onToggle`, `disabled` |
| **States** | Unselected (border + white bg), Selected (primary border + tint bg), Disabled |
| **Usage** | Expertise (specializations), Offers (modalities) |

### S-02: Chip

| Attribute | Value |
|---|---|
| **Purpose** | Toggle chip for selecting/deselecting a single option |
| **Props** | `label`, `selected`, `onToggle`, `disabled` |
| **States** | Unselected (border + white), Selected (primary bg + white text), Disabled |
| **Usage** | Expertise (languages, practice areas) |

### S-03: SegmentedControl

| Attribute | Value |
|---|---|
| **Purpose** | Mutually exclusive option selector |
| **Props** | `options` ({value, label}[]), `value`, `onChange`, `ariaLabel` |
| **States** | Default, Selected option highlighted |
| **Usage** | Offers (duration) |

### S-04: ToggleSwitch

| Attribute | Value |
|---|---|
| **Purpose** | On/off switch for boolean values |
| **Props** | `checked`, `onChange`, `label`, `disabled` |
| **States** | Off (gray), On (primary), Disabled |
| **Usage** | Offers (active toggle), Dashboard (publish/unpublish) [Future: notification toggles] |

---

## Status

### ST-01: SectionStatus

| Attribute | Value |
|---|---|
| **Purpose** | Completion indicator for a section |
| **Props** | `status` (complete/incomplete/partial), `label` |
| **States** | Complete (✅ + green), Incomplete (❌ + gray), Partial (⚠️ + amber) |
| **Usage** | Dashboard section cards |

### ST-02: StatusBadge

| Attribute | Value |
|---|---|
| **Purpose** | Profile status badge |
| **Props** | `status` (DRAFT/PENDING_VERIFICATION/PUBLISHED/UNPUBLISHED) |
| **States** | Draft (gray), Pending (amber), Published (green), Unpublished (gray) |
| **Usage** | Dashboard, Profile hero |

### ST-03: CompletionProgress

| Attribute | Value |
|---|---|
| **Purpose** | Visual progress indicator for profile completion |
| **Props** | `percentage`, `label` (optional) |
| **States** | 0% (empty), partial (partial fill), 100% (full + check) |
| **Variants** | Bar (horizontal), Circular (for hero) |
| **Usage** | Dashboard, Profile hero |

### ST-04: EmptyState

| Attribute | Value |
|---|---|
| **Purpose** | Placeholder for empty content areas |
| **Props** | `icon`, `title`, `description`, `action` (button/link) |
| **States** | Default |
| **Usage** | All cards when empty, practice areas when no specialization selected, offers when no offers |

### ST-05: ValidationError

| Attribute | Value |
|---|---|
| **Purpose** | Inline error message for form fields |
| **Props** | `message` |
| **States** | Default (red text + icon) |
| **Usage** | All input components |

### ST-06: SavedIndicator

| Attribute | Value |
|---|---|
| **Purpose** | Brief "✓ Enregistré" confirmation |
| **Props** | `visible`, `message` (default: "Enregistré") |
| **States** | Hidden, Visible (auto-dismiss after 2s) |
| **Usage** | EditableCard after successful save |

---

## Timeline

### T-01: TimelineList

| Attribute | Value |
|---|---|
| **Purpose** | Vertical timeline container with connecting line |
| **Props** | `children` (TimelineItem[]) |
| **States** | Default |
| **Features** | Vertical line connecting items, dot markers per item |
| **Usage** | Education timeline, Experience timeline |
| **Version** | Next |

### T-02: TimelineItem

| Attribute | Value |
|---|---|
| **Purpose** | Single entry in a timeline |
| **Props** | `title`, `subtitle`, `dateRange`, `description`, `onEdit`, `onDelete`, `isEditing`, `editForm` |
| **States** | Read mode (display), Edit mode (inline form) |
| **Visual** | Dot marker on left, content on right, connecting line |
| **Usage** | Inside TimelineList |
| **Version** | Next |

### T-03: AddTimelineEntry

| Attribute | Value |
|---|---|
| **Purpose** | Button + inline form for adding a new timeline entry |
| **Props** | `label` (e.g., "+ Ajouter une formation"), `fields`, `onSubmit`, `onCancel` |
| **States** | Collapsed (just button), Expanded (inline form) |
| **Usage** | At the bottom of TimelineList |
| **Version** | Next |

---

## Preview

### P-01: ProfileHeader

| Attribute | Value |
|---|---|
| **Purpose** | Public profile header with photo, name, title, bar, city |
| **Props** | `photoUrl`, `firstName`, `lastName`, `professionalTitle`, `barAssociationName`, `cityName`, `verified` (boolean), `completionPercentage` (optional, for edit-mode hero) |
| **States** | Filled, Empty (placeholders) |
| **Usage** | Public Preview, Profile page Hero |
| **Future** | Verification badge, video presentation link |

### P-02: PublicSection

| Attribute | Value |
|---|---|
| **Purpose** | Read-only section wrapper for public profile |
| **Props** | `title`, `children`, `hideIfEmpty` (default true) |
| **States** | Visible, Hidden (if empty and hideIfEmpty) |
| **Usage** | Public Preview page |
| **Key behavior** | If no content, the entire section is hidden (not shown with empty state) |

### P-03: OfferPreviewCard

| Attribute | Value |
|---|---|
| **Purpose** | Client-facing offer preview |
| **Props** | `name`, `city`, `specialties`, `title`, `price`, `currency`, `durationMinutes`, `modalities`, `photoUrl` |
| **States** | Filled, Partial (some fields empty) |
| **Usage** | Offers page (sticky right), Public Preview, Dashboard thumbnail |
| **Features** | Updates in real-time on Offers page |

### P-04: ProfileThumbnail

| Attribute | Value |
|---|---|
| **Purpose** | Mini profile card for Dashboard |
| **Props** | `photoUrl`, `name`, `title`, `city`, `specialty` |
| **States** | Filled, Empty (placeholder) |
| **Usage** | Dashboard |
| **Features** | "Voir l'aperçu complet" link |

---

## Future Components

### FU-01: ReviewsCard

| Attribute | Value |
|---|---|
| **Purpose** | Display client reviews with rating summary |
| **Props** | `averageRating`, `totalReviews`, `reviews` (Review[]) |
| **Version** | Future |

### FU-02: ArticlesList

| Attribute | Value |
|---|---|
| **Purpose** | Display published articles |
| **Props** | `articles` (Article[]) |
| **Version** | Future |

### FU-03: StatisticsCard

| Attribute | Value |
|---|---|
| **Purpose** | Display KPIs on Dashboard |
| **Props** | `views`, `requests`, `completedConsultations`, `rating` |
| **Version** | Future |

### FU-04: AwardsCard

| Attribute | Value |
|---|---|
| **Purpose** | Display awards and recognitions |
| **Props** | `awards` (Award[]) |
| **Version** | Future |

### FU-05: VideoPresentation

| Attribute | Value |
|---|---|
| **Purpose** | Embedded video player for professional presentation |
| **Props** | `videoUrl`, `thumbnailUrl` |
| **Version** | Future |

### FU-06: VerifiedBadge

| Attribute | Value |
|---|---|
| **Purpose** | Verification badge with tooltip |
| **Props** | `verified`, `tooltip` |
| **States** | Verified (✓ + "Vérifié"), Unverified (hidden) |
| **Version** | Next (basic), Future (with document verification) |

### FU-07: MapEmbed

| Attribute | Value |
|---|---|
| **Purpose** | Google Maps embed for office location |
| **Props** | `latitude`, `longitude`, `address`, `googleMapsUrl` |
| **Version** | Next |

### FU-08: ActivityFeed

| Attribute | Value |
|---|---|
| **Purpose** | Recent activity list on Dashboard |
| **Props** | `activities` (Activity[]) |
| **Version** | Future |

### FU-09: NotificationBell

| Attribute | Value |
|---|---|
| **Purpose** | Notification indicator with unread count |
| **Props** | `count`, `onClick` |
| **Version** | Future |

### FU-10: MultiOfferList

| Attribute | Value |
|---|---|
| **Purpose** | Container for multiple offers with ordering |
| **Props** | `offers`, `onReorder`, `onAdd`, `onEdit`, `onDelete` |
| **Features** | Drag-to-reorder [Future] |
| **Version** | MVP (basic list), Future (drag reorder) |

---

## Component Dependency Graph

```
AppShell
├── Sidebar
│   └── NavLink
├── BottomTabBar (mobile)
├── MobileDrawer (mobile)
│   └── NavLink
└── MainContent
    ├── PageHeader
    ├── ResponsiveGrid
    │   ├── DashboardSectionCard
    │   │   └── SectionStatus
    │   ├── ToggleCard
    │   └── Chip
    ├── Card
    ├── EditableCard
    │   ├── TextInput
    │   ├── TextArea
    │   ├── Select
    │   ├── ImageUploadSlot
    │   ├── UrlInput
    │   ├── SavedIndicator
    │   └── ValidationError
    ├── IdentityCard → EditableCard
    ├── BiographyCard → EditableCard
    ├── ContactCard → EditableCard
    ├── OfficeCard → EditableCard
    ├── LanguagesCard
    ├── OfferCard → EditableCard
    │   ├── SegmentedControl
    │   ├── ToggleCard
    │   └── ToggleSwitch
    ├── PublicationCard
    │   ├── StatusBadge
    │   └── CompletionProgress
    ├── QuickLinks
    ├── ProfileHeader
    ├── ProfileThumbnail
    ├── OfferPreviewCard
    ├── PublicSection
    ├── TimelineList
    │   ├── TimelineItem
    │   └── AddTimelineEntry
    ├── EmptyState
    ├── StickyActionBar
    └── [Future]
        ├── ReviewsCard
        ├── ArticlesList
        ├── StatisticsCard
        ├── AwardsCard
        ├── VideoPresentation
        ├── VerifiedBadge
        ├── MapEmbed
        ├── ActivityFeed
        └── NotificationBell
```
