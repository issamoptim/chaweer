# F-03 Frontend Review — Product & UX Audit

> **Status:** Final
> **Date:** 2026-07-22
> **Reviewer:** Senior Product Designer & Product Owner
> **Scope:** Professional Workspace onboarding (PR-3 frontend adaptation)

---

## 1. Executive Summary

The Professional Workspace onboarding is a **structurally sound, visually polished** foundation that currently functions as a **form-filling exercise** rather than a **profile-building journey**. The design system is consistent, the expertise page UX is genuinely well-designed, and the offer preview card is a strong product feature. However, the current onboarding does not align with the core product KPI: **helping a lawyer publish a trustworthy profile as quickly as possible**.

The central concept that must guide all future work is **Publication Readiness** — "Is this profile ready to be published?" is fundamentally different from "Is this profile complete?". A profile at 40% completion can be 100% publication-ready. The current onboarding conflates these two concepts, forcing the lawyer to complete optional information (languages, practice areas) before advancing, and missing mandatory information (consultation title, consultation description) entirely.

**Top concerns:**
- Missing mandatory fields: consultation title, consultation description
- Duration field should be removed entirely
- Modalities should be Video / Audio / Chat (not Video / Office)
- Bio has no minimum length requirement (should be 200 characters)
- Expertise page blocks advancement on optional fields (languages, practice areas)
- No Publication Readiness indicator or publish button
- No loading states on any page
- No mobile sidebar handling

**Maturity score: 6.5 / 10** — see conclusion for details.

---

## 2. Product Philosophy

### 2.1 Publish Fast, Enrich Later

The onboarding objective is **NOT** to collect a complete professional profile. The objective is to allow a legal professional to **publish a trustworthy profile as quickly as possible**, then progressively enrich it over time.

### 2.2 Publication ≠ Verification

- **Publication**: A lawyer can publish their profile immediately once all publication requirements are satisfied.
- **Verification**: An independent process introduced in V1. Professionals submit supporting documents, and once validated by the Chaweer team, they receive a "Verified Professional" badge.
- **Publication must NEVER depend on verification.**

### 2.3 Publication Readiness

The central product concept. Instead of asking "Is the profile complete?", the product should ask "Is this profile ready to be published?". Those are two very different questions:

- A profile may be 40% complete while already being 100% publishable.
- A profile can be enriched after publication.

The onboarding, validation logic, UX, and all future reviews should be evaluated using this philosophy.

### 2.4 KPI

The onboarding should optimize for one KPI: **Successfully publishing a profile.**

Not: Completing every possible profile section.

---

## 3. Product Principles

These principles are the founding product laws of Chaweer. Every future product decision, feature, or field must be evaluated against them.

### P1 — Publish Fast, Enrich Later

**Why it exists**: The biggest risk for a marketplace is never having enough supply. If onboarding is long and demanding, professionals abandon before publishing. A published profile — even an incomplete one — is infinitely more valuable than an unpublished perfect one.

**How it influences future decisions**: Any feature that adds friction to the publication path must be rejected or deferred to post-publication. The onboarding should be measured in minutes, not hours. New fields are optional by default; mandatory only when they are true trust requirements.

### P2 — Never Block Publication with Optional Information

**Why it exists**: A lawyer who has provided their name, bar association, biography, legal domain, and consultation offer has given enough information for a visitor to make a booking decision. Blocking publication because they haven't uploaded a photo or selected languages adds friction without adding trust.

**How it influences future decisions**: If a field is not in the publication requirements list, it can never block the publish action. Validation logic must enforce this separation. Optional fields can be encouraged, highlighted, and suggested — but never gated.

### P3 — Every Required Field Must Increase User Trust

**Why it exists**: Mandatory fields are friction. Each one must justify its cost. If a field doesn't make a visitor more likely to trust the professional, it shouldn't be mandatory. The current mandatory fields (name, bar, bio, domain, offer) all serve this purpose: they answer "who are you?", "are you legitimate?", "what do you do?", and "what will I get?".

**How it influences future decisions**: Before adding a new mandatory field, the product team must answer: "Does this field increase visitor trust?" If the answer is no, the field is optional. If the answer is maybe, the field is optional until validated by data.

### P4 — Every Optional Field Must Increase Profile Visibility

**Why it exists**: Optional fields exist to enrich the profile, not to gate it. Their value proposition to the professional is: "completing this will make you more visible, more credible, or more likely to be booked." If an optional field doesn't serve this purpose, it's noise.

**How it influences future decisions**: Optional fields should always be presented with a benefit statement: "Add a photo to increase your visibility", "Add legal situations to be matched with more client cases." If we can't articulate the benefit, the field shouldn't exist.

### P5 — Explain Why Information Is Requested

**Why it exists**: Lawyers are not product users by default. They don't understand why a platform asks for certain information. Without context, mandatory fields feel like administrative bureaucracy. With context, they feel like building a professional presence.

**How it influences future decisions**: Every form field, every card, every section should have a one-line explanation of why the information matters. Not just what to fill, but why it matters for the professional's goals (publication, visibility, bookings).

### P6 — Guide Users Toward Publication Instead of Preventing Them

**Why it exists**: Disabling a button silently is the worst UX pattern for goal-oriented users. It creates confusion, frustration, and abandonment. Instead of saying "you can't publish", the product should say "here's what you need to publish."

**How it influences future decisions**: The publish button is never silently disabled. If requirements are missing, the button is clickable and shows a clear explanation of what's missing. Validation is guidance, not punishment. Error messages are actionable, not just descriptive.

### P7 — Publication Is a Milestone, Not the End of Onboarding

**Why it exists**: Publication is the beginning of the professional's journey on Chaweer, not the end. After publication, the profile can and should be enriched. Treating publication as the finish line creates a "set it and forget it" mentality that results in incomplete, unattractive profiles.

**How it influences future decisions**: The success screen after publication is not a dead end. It's a transition from "onboarding" to "enrichment." The post-publication experience should immediately suggest next steps: add a photo, add more domains, add legal situations. Profile Completion % replaces Publication Readiness % as the new north star.

### P8 — Reduce Friction Without Reducing Trust

**Why it exists**: There is a constant tension between making onboarding fast and making the profile trustworthy. Removing mandatory fields makes onboarding faster but may reduce trust. Adding mandatory fields increases trust but may cause abandonment. The product must find the minimum viable trust threshold and never go below it.

**How it influences future decisions**: Friction reduction is only valid if it doesn't remove trust signals. Auto-filling fields, providing smart defaults, and offering progressive disclosure are preferred over removing fields. The trust threshold is defined by the publication requirements and can only be raised (not lowered) after data validation.

---

## 4. Business Rules

These rules formalize the product logic. They are the executable specification for the application.

### 4.1 Publication

```
RULE P-01: Publication Readiness
IF all mandatory fields are completed
THEN Publication Readiness = 100%
AND "Publish Profile" button is enabled
ELSE Publication Readiness < 100%
AND "Publish Profile" button shows missing requirements
```

```
RULE P-02: Publication Action
IF user clicks "Publish Profile"
AND Publication Readiness = 100%
THEN profile status becomes PUBLISHED
AND profile is visible on the marketplace
AND success screen is displayed
AND enrichment prompts are shown
```

```
RULE P-03: Publication Blocked
IF user clicks "Publish Profile"
AND Publication Readiness < 100%
THEN display list of missing mandatory requirements
AND do NOT change profile status
AND guide user to the first missing requirement
```

### 4.2 Modification

```
RULE M-01: Published Profile Modification
IF profile status = PUBLISHED
AND user modifies any field
THEN changes are saved immediately
AND profile remains PUBLISHED
AND no re-approval is required
```

```
RULE M-02: Mandatory Field Clearance
IF profile status = PUBLISHED
AND user clears a mandatory field
THEN display warning: "This field is required for publication. Clearing it will unpublish your profile."
AND require explicit confirmation
IF confirmed
THEN profile status becomes DRAFT
AND profile is no longer visible on the marketplace
```

### 4.3 Optional Fields

```
RULE O-01: Optional Field Behavior
IF field is classified as OPTIONAL
THEN field can be empty
AND field does NOT affect Publication Readiness
AND field does NOT block publication
AND field is displayed on public profile when completed
AND field is omitted from public profile when empty
```

```
RULE O-02: Optional Field Encouragement
IF profile status = PUBLISHED
AND optional fields are empty
THEN display enrichment prompts
AND show Profile Completion % < 100%
AND suggest specific fields to complete
```

### 4.4 Future Verification

```
RULE V-01: Verification Independence
IF profile status = PUBLISHED
THEN profile is visible on the marketplace
AND verification status does NOT affect visibility
AND verification status is displayed as "Unverified" by default
```

```
RULE V-02: Verification Process (V1)
IF user submits verification documents
AND admin approves documents
THEN verification status becomes VERIFIED
AND "Verified Professional" badge is displayed on profile
AND profile ranking may be boosted (future)
```

```
RULE V-03: Verification Rejection
IF admin rejects verification documents
THEN verification status remains UNVERIFIED
AND user is notified with reasons
AND user can resubmit documents
AND profile remains PUBLISHED
```

### 4.5 Visibility

```
RULE VIS-01: Marketplace Visibility
IF profile status = PUBLISHED
THEN profile appears in marketplace search results
AND profile appears in AI recommendations
AND profile has a public URL
ELSE profile does NOT appear in marketplace
AND profile does NOT have a public URL
```

```
RULE VIS-02: Missing Mandatory Fields Display
IF a mandatory field is missing on a published profile (edge case after RULE M-02)
THEN profile is automatically unpublished
AND user is notified
```

---

## 5. Decision Framework

Every future feature, field, or product change must be evaluated using this framework before implementation.

### 5.1 New Field Evaluation

For every proposed new field, answer the following questions in order:

**Question 1: Does it increase visitor trust?**
- If YES → continue to Question 2
- If NO → the field is optional at best, or should not exist

**Question 2: Is it indispensable before publication?**
- If YES → continue to Question 3
- If NO → the field is optional, add it as post-publication enrichment

**Question 3: Can it be completed after publication without harm?**
- If YES → make it optional, encourage post-publication
- If NO → make it mandatory for publication

**Question 4: Does it only increase profile quality (not trust)?**
- If YES → make it optional, display on public profile when filled
- If NO → continue to Question 5

**Question 5: Should it be mandatory?**
- Apply the P3 test: "Does this field increase visitor trust?"
- Apply the P2 test: "Can we publish without it?"
- If both tests pass → mandatory
- If either test fails → optional

### 5.2 New Feature Evaluation

For every proposed new feature:

1. **Does it reduce friction toward publication?** If yes, prioritize. If no, continue.
2. **Does it add friction toward publication?** If yes, defer to post-publication or reject.
3. **Does it require new mandatory fields?** If yes, apply the New Field Evaluation framework.
4. **Does it affect the Publication Readiness calculation?** If yes, update the checklist and weights.
5. **Does it affect the Profile Completion calculation?** If yes, update the post-publication model.
6. **Is it compatible with the marketplace vision?** If no, reject or redesign.
7. **Is it compatible with future verification?** If no, reject or redesign.

### 5.3 Feature Deprioritization Criteria

A feature should be deprioritized if:
- It adds mandatory fields without increasing trust
- It blocks publication for non-trust reasons
- It serves the platform's needs rather than the professional's or visitor's needs
- It cannot be explained in one sentence to a lawyer

---

## 6. Field Classification

### 6.1 Required for Publication

| Field | Current state | Gap |
|-------|--------------|-----|
| First name | Collected, mandatory | — |
| Last name | Collected, mandatory | — |
| Bar association | Collected via select, but NOT mandatory | **Make mandatory** |
| Biography | Collected, but no minimum length | **Add 200-char minimum** |
| At least 1 legal practice domain | Collected, but areas + languages also required | **Only require 1 domain. Areas and languages become optional** |
| Consultation title | NOT collected | **Add as mandatory field** |
| Consultation description | NOT collected | **Add as mandatory field** |
| Consultation price | Collected, mandatory | — |
| At least 1 consultation modality | Collected, but modalities are VIDEO/OFFICE | **Change to VIDEO/AUDIO/CHAT** |

### 6.2 Optional but Recommended (Does NOT Block Publication)

| Field | Current state | Notes |
|-------|--------------|-------|
| Professional photo | Collected, optional | Initials fallback if absent |
| Professional title | Collected, optional | Free text, available but optional |
| Additional legal domains | Available | Beyond the mandatory 1 |
| Additional legal situations | Available | Beyond selected domains |
| Languages | Collected, but currently mandatory | **Make optional** |
| Office information | Not in onboarding | Available in product, not required |
| Contact information | Not in onboarding | Available in product, not required |

### 6.3 Future Enrichment (Not in MVP)

Education, Professional experience, Certifications, Memberships, Publications, Availability, Other future sections.

### 6.4 Removed from Product

| Field | Reason |
|-------|--------|
| Consultation duration | **Removed entirely**. The platform provides a single consultation service. Duration is no longer a concept. |
| "Office" modality | Replaced by Audio and Chat modalities. |

---

## 7. Publication Readiness Assessment

### 7.1 Does the Current Onboarding Support the Publish-Fast KPI?

**No.** The current onboarding does not support the publish-fast KPI:

1. **Missing mandatory fields**: Consultation title and description are required for publication but are not collected.
2. **Optional fields block advancement**: The expertise page requires at least 1 specialization + 1 practice area + 1 language to proceed. Under the new philosophy, only 1 domain is mandatory.
3. **No Publication Readiness indicator**: The interface shows "Etape 1 sur 3" but never shows how close the lawyer is to publishing.
4. **No publish button**: The onboarding ends with a success screen that says "configured" but does not mention publication.
5. **Duration field wastes time**: The duration SegmentedControl (15/30/45/60 min) is being removed from the product.
6. **Wrong modalities**: VIDEO and OFFICE are the current options. The product requires VIDEO, AUDIO, and CHAT.

### 7.2 Publication Checklist (Target State)

The application should maintain a publication checklist that tracks mandatory requirements:

```
[x] First name
[x] Last name
[x] Bar association
[ ] Biography (minimum 200 characters)
[x] At least one legal practice domain
[ ] Consultation title
[ ] Consultation description
[ ] Consultation price
[ ] At least one consultation modality
```

As long as one mandatory requirement is missing, the profile cannot be published.

### 7.3 Publish Button Behaviour

The "Publish Profile" button should **never fail silently**. If the lawyer attempts to publish without satisfying all mandatory requirements, the application should clearly explain why:

> Your profile cannot be published yet.
>
> Missing information:
> - Biography (minimum 200 characters)
> - Consultation title
> - Consultation description
> - Consultation price
> - Consultation modality

The objective is to **guide the lawyer toward publication** instead of simply disabling the button.

### 7.4 Publication Readiness Indicator

The interface should continuously show how close the lawyer is to publishing. Once all mandatory requirements are completed, the indicator reaches 100%, and the "Publish Profile" button becomes available.

After publication, this indicator should evolve into a broader "Profile Completion" score, encouraging lawyers to enrich their profiles over time without preventing publication.

### 7.5 Progressive Enrichment After Publication

Once the profile has been published, the application should continue encouraging the lawyer to improve it:

> Congratulations! Your profile is now published.
>
> Increase your visibility by completing your profile:
> - Add a professional photo
> - Add more legal practice domains
> - Add legal situations
> - Add languages
> - Add office information

This creates a progressive profile completion experience instead of forcing everything during onboarding.

---

## 8. First Impression Walkthrough

### 8.1 Registration

**Page**: `ProfessionalRegistrationPage.tsx`

A lawyer arrives at the registration page. The layout is clean, centered, with the Chaweer brand and "Espace professionnel" badge. The form asks for email, password, and confirmation. Google OAuth is available. The existing-client notice is a thoughtful touch.

**Friction points:**
- No explanation of what Chaweer is or what happens after registration
- No mention of the bar association requirement or what information will be needed
- The CTA is clear but doesn't set expectations about the onboarding journey

**Verdict**: Registration is smooth. The main gap is **expectation setting**.

### 8.2 Landing on Profile Page

After registration, the user is redirected to `/pro/profil`. They see a sidebar, an onboarding stepper, a header, three cards, and a sticky action bar.

**Friction points:**
- **No welcome message or context**. The lawyer lands directly in a form
- **Sidebar shows "Bientot" items** (Tableau de bord, Disponibilites, Publication) — confusing during onboarding. What's available? What's not?
- **No explanation of why this information matters**. The subtitle "Ces informations constitueront votre presentation publique" is good but insufficient
- **No Publication Readiness indicator**. The lawyer has no idea how far they are from publishing
- **Photo upload is the first thing** in the personal info card — but photo is optional. Leading with an optional field sends the wrong signal about priorities
- **No loading skeleton** — the form shows empty fields while data loads from the API, creating a flash of empty state

**Verdict**: The page is functional but lacks narrative. A lawyer feels like they're filling an administrative form, not building a professional presence.

### 8.3 Filling the Profile

The lawyer fills in their first name, last name, professional title (optional), selects a bar association, and writes a bio.

**Friction points:**
- **Bar association is not marked as mandatory** — the `required` prop is only on first name and last name
- **Bio has no minimum length guidance** — the textarea shows a character counter (0/600) but doesn't indicate that 200 characters are required for publication
- **No inline validation** — the only feedback is the disabled/enabled state of the "Enregistrer et continuer" button
- **"Enregistrer et continuer" forces advancement** — there's no "save and stay" option. If the lawyer wants to save without leaving the page, they can't
- **No unsaved changes warning** — if the lawyer navigates away via the sidebar with unsaved changes, they lose their data silently

**Verdict**: The form works but doesn't guide the lawyer toward publication. The lawyer doesn't know which fields are mandatory for publication and which are optional enrichment.

### 8.4 Expertise Page

The lawyer arrives on the expertise page. The header copy is excellent: "Vos clients decrient un probleme concret, pas un domaine du droit. Indiquez les situations que vous traitez pour etre propose au bon moment."

**Friction points:**
- **All three blocks are mandatory** — the lawyer must select at least 1 specialization + 1 practice area + 1 language to proceed. Under the new philosophy, only 1 domain is mandatory. Practice areas and languages are optional.
- **No guidance on how many to select** — "Select 2-5 specialties for optimal visibility" would help
- **No search/filter** — if the list grows to 18 domains (the finalized taxonomy), the grid is manageable. But if domains have many situations, the page becomes long
- **The cascading logic is well-designed** — deselecting a specialization removes its practice areas. This is a strong UX pattern.
- **The empty state for situations is good** — the dashed border box with the Layers icon and helpful text

**Verdict**: The expertise page is the best-designed page in the onboarding. However, it **over-enforces optionality**. A lawyer who just wants to publish quickly should be able to select 1 domain and move on.

### 8.5 Offer Page

The lawyer arrives on the offer page. They see a price input, a duration SegmentedControl, modality toggle cards, and a preview card on the right.

**Friction points:**
- **No consultation title field** — this is mandatory for publication but not collected
- **No consultation description field** — this is mandatory for publication but not collected
- **Duration SegmentedControl** — this field is being removed from the product entirely
- **Modalities are VIDEO/OFFICE** — should be VIDEO/AUDIO/CHAT
- **Price input only accepts integers** — `setPrice(e.target.value.replace(/[^0-9]/g, ""))` strips decimals. Some lawyers may want to charge 250.50 DH
- **The preview card is a strong feature** — real-time feedback on what clients will see builds confidence
- **No price range guidance** — "La moyenne pour votre specialite est de X DH" would help lawyers who don't know what to charge

**Verdict**: The offer page is the most problematic. It's missing 2 mandatory fields, includes 1 field that should be removed, and has wrong modality options. The preview card is excellent and should be retained.

### 8.6 Success Screen

After completing the offer, the lawyer sees a success screen: "Votre profil professionnel est configure" with a disabled "Acceder a mon tableau de bord" button (marked "Bientot") and a "Retour au site" link.

**Friction points:**
- **"Configure" is not "published"** — the lawyer has no sense that their profile is now public or that they've achieved a milestone
- **The disabled "Bientot" button feels unfinished** — it's a dead end
- **No mention of publication** — the success screen should say "Your profile is ready to be published" or "Your profile is now published"
- **No enrichment prompts** — the lawyer should be encouraged to add photo, more domains, languages, etc.
- **No next steps** — the lawyer is left in a void

**Verdict**: The success screen is the weakest moment in the onboarding. It undermines the entire journey by ending on an unfinished note.

---

## 9. Page-by-Page Review

### 9.1 ProfessionalProfilePage

**File**: `apps/web/src/features/professional/pages/ProfessionalProfilePage.tsx`

#### 10 UX Questions

**1. Is the information hierarchy optimal?**
Partially. The page leads with photo upload (optional) before name fields (mandatory). Mandatory fields should come first to signal priority. The three-card structure (personal / professional / bio) is logical but the ordering within cards needs adjustment.

**2. Is the form easy to understand?**
Yes. Labels are clear, placeholders are helpful (Amina, El Fassi), and the card titles provide structure. A lawyer would understand what's being asked.

**3. Is anything confusing for a lawyer?**
The bar association select is clear. However, the lawyer doesn't know which fields are mandatory for publication and which are optional. There's no visual distinction between "required for publication" and "optional enrichment".

**4. Are important fields missing?**
No fields are missing from the current form, but the bar association should be marked as mandatory and the bio should have a 200-character minimum.

**5. Are unnecessary fields present?**
No. All current fields serve a purpose. Photo and professional title are optional but reasonable to include.

**6. Does it inspire professionalism?**
Moderately. The design is clean and the card-based layout is professional. However, the lack of context ("why are we asking this?") and the absence of trust signals makes it feel administrative rather than empowering.

**7. Does it feel premium?**
The visual design is premium (rounded corners, subtle shadows, teal accent color). But the UX doesn't feel premium — no loading skeletons, no inline validation, no progressive disclosure.

**8. Is the progression clear?**
The stepper at the top shows 3 steps. The "Enregistrer et continuer" CTA makes it clear that this is a multi-step flow. However, the lawyer doesn't know what comes after the 3 steps or what the end goal is.

**9. How could completion be better visualized?**
Replace the 3-step stepper with a Publication Readiness indicator. Show which mandatory fields are completed and which are missing. Show a percentage based on publication requirements, not onboarding steps.

**10. What UX improvements would you recommend?**
- Reorder: mandatory fields first (name, bar, bio), optional fields after (photo, title)
- Add visual distinction between mandatory and optional fields
- Add inline validation for bio minimum length
- Add a "Save and stay" secondary CTA
- Add loading skeletons
- Add a contextual hint near bar association: "Verifie par notre equipe avant publication"

#### Field Classification

| Field | Classification | Current behavior | Required behavior |
|-------|---------------|-----------------|-------------------|
| Photo | Optional | Collected, optional | Keep optional, move after mandatory fields |
| First name | Required | Collected, mandatory | Keep |
| Last name | Required | Collected, mandatory | Keep |
| Professional title | Optional | Collected, optional | Keep optional |
| Bar association | Required | Collected, NOT mandatory | **Make mandatory** |
| Bio | Required (200+ chars) | Collected, no minimum | **Add 200-char minimum** |

### 9.2 ProfessionalExpertisePage

**File**: `apps/web/src/features/professional/pages/ProfessionalExpertisePage.tsx`

#### 10 UX Questions

**1. Is the information hierarchy optimal?**
Yes. The three-block structure (specialties → situations → languages) follows a natural top-down logic. Selecting a specialty reveals its situations. This is well-designed.

**2. Is the form easy to understand?**
Yes. The header copy is the best in the entire onboarding: "Vos clients decrient un probleme concret, pas un domaine du droit." The cascading logic (select specialty → see situations) is intuitive.

**3. Is anything confusing for a lawyer?**
The terms "specialites" and "situations" are clear. However, the lawyer doesn't know that only 1 domain is mandatory — the current validation requires all three blocks to have at least 1 selection.

**4. Are important fields missing?**
No. The page collects domains, situations, and languages. All necessary fields are present.

**5. Are unnecessary fields present?**
No fields are unnecessary, but **languages should not be mandatory**. Under the new philosophy, languages are optional enrichment.

**6. Does it inspire professionalism?**
Yes. The expertise page is the most professional-feeling page. The ToggleCard pattern, the cascading selection, and the "Tout selectionner" / count display all contribute to a sense of control and expertise.

**7. Does it feel premium?**
Yes. The interaction design (toggle cards with checkmarks, chip selection for languages, count badges) is the most polished part of the onboarding.

**8. Is the progression clear?**
Yes. The numbered sections (1. Vos specialites, 2. Situations, 3. Langues) provide clear structure.

**9. How could completion be better visualized?**
The sticky action bar shows "X specialites · Y situations · Z langues" which is good. But it should distinguish between the mandatory requirement (1 domain) and optional enrichment (more domains, situations, languages).

**10. What UX improvements would you recommend?**
- Change validation: only require 1 domain. Remove the requirement for 1 area and 1 language.
- Add guidance: "Selectionnez au moins un domaine pour publier votre profil"
- Mark languages section as optional: "Langues de consultation (optionnel)"
- Add a "Passer cette etape" or "Continuer" option that doesn't require all 3 blocks

#### Field Classification

| Field | Classification | Current behavior | Required behavior |
|-------|---------------|-----------------|-------------------|
| Legal domains (specializations) | Required (at least 1) | Mandatory | Keep mandatory, but only 1 |
| Legal situations (practice areas) | Optional | Mandatory (at least 1) | **Make optional** |
| Languages | Optional | Mandatory (at least 1) | **Make optional** |

### 9.3 ProfessionalOfferPage

**File**: `apps/web/src/features/professional/pages/ProfessionalOfferPage.tsx`

#### 10 UX Questions

**1. Is the information hierarchy optimal?**
No. The page leads with price (correct — high visual priority) but then shows duration (being removed) before modalities. The missing title and description fields should come before price to provide context.

**2. Is the form easy to understand?**
Partially. The price input with "DH" suffix is clear. The duration SegmentedControl is clear but should not exist. The modality toggle cards are clear but use wrong options.

**3. Is anything confusing for a lawyer?**
The lawyer doesn't know what the consultation title and description should contain because they're not asked. The preview card helps visualize the end result but is incomplete without a title.

**4. Are important fields missing?**
**Yes — critically.** Consultation title and consultation description are mandatory for publication but are not collected.

**5. Are unnecessary fields present?**
**Yes.** Consultation duration is being removed from the product entirely.

**6. Does it inspire professionalism?**
The preview card is a strong professional feature. But the incomplete form (missing title/description) makes the page feel unfinished.

**7. Does it feel premium?**
The preview card with real-time updates feels premium. The price input with DH suffix is clean. But the overall experience is undermined by the missing fields.

**8. Is the progression clear?**
The "Terminer la configuration" CTA is clear. But "configuration" is not "publication". The lawyer doesn't understand that they're building toward a publishable profile.

**9. How could completion be better visualized?**
The sticky action bar shows "Pret a finaliser votre configuration" or "Renseignez un tarif et au moins une modalite." This should be replaced with Publication Readiness language.

**10. What UX improvements would you recommend?**
- Add consultation title field (mandatory)
- Add consultation description field (mandatory)
- Remove duration SegmentedControl entirely
- Change modalities to VIDEO / AUDIO / CHAT
- Update preview card to show title and description
- Update CTA to "Publier mon profil" when all requirements are met

#### Field Classification

| Field | Classification | Current behavior | Required behavior |
|-------|---------------|-----------------|-------------------|
| Consultation title | Required | NOT collected | **Add as mandatory** |
| Consultation description | Required | NOT collected | **Add as mandatory** |
| Consultation price | Required | Collected, mandatory | Keep |
| Consultation duration | **Removed** | Collected via SegmentedControl | **Remove entirely** |
| Consultation modalities | Required (at least 1) | VIDEO/OFFICE | **Change to VIDEO/AUDIO/CHAT** |

---

## 10. Information Architecture Assessment

### 10.1 Current Step Order

1. **Profil** — identity (name, title, photo, bar) + bio
2. **Expertise** — domains, situations, languages
3. **Offre** — price, duration, modalities

### 10.2 Is the Order Optimal for Publication Readiness?

**No.** The current order frontloads optional information (photo, title) and backloads the most critical publication requirement (consultation offer). A lawyer could fill the entire profile and expertise pages but still not have a publishable profile because the offer is incomplete.

### 10.3 Proposed Reorder

Under the publish-fast philosophy, the onboarding should frontload **mandatory publication requirements** and defer optional enrichment:

**Option A: Keep 3 steps, change validation**
1. **Profil** — name, bar association (mandatory), bio (200+ chars), photo + title (optional)
2. **Expertise** — at least 1 domain (mandatory), situations + languages (optional)
3. **Offre** — title, description, price, modalities (all mandatory), no duration

This is the least disruptive change. The stepper stays the same, but validation changes to only enforce mandatory fields.

**Option B: 2 steps + optional enrichment**
1. **Profil** — name, bar, bio, at least 1 domain, consultation title/description/price/modalities
2. **Enrichissement** (optional) — photo, title, more domains, situations, languages, office

This is more aggressive but better aligned with the publish-fast KPI. The lawyer completes only what's needed to publish, then is encouraged to enrich.

**Recommendation**: **Option A** for pragmatism. Keep the 3-step structure but change validation to only enforce publication requirements. Mark optional fields clearly. This minimizes implementation effort while aligning with the philosophy.

### 10.4 Should Sections Be Merged or Split?

- **Profile page**: Consider splitting "Informations personnelles" (name, photo) from "Informations professionnelles" (title, bar) — but this is a minor improvement. The current card structure is acceptable.
- **Expertise page**: Keep as-is. The 3-block structure is well-designed. Just change validation.
- **Offer page**: Add title and description as a new card before price. Remove duration card entirely.

### 10.5 Does a Lawyer Understand Why Each Step Exists?

- **Profile**: Yes — "Ces informations constitueront votre presentation publique" sets context
- **Expertise**: Yes — "Vos clients decrient un probleme concret" is excellent copy
- **Offer**: Partially — "Definissez les conditions de votre consultation" is clear but doesn't explain why title and description matter for publication

---

## 11. Trust Building Evaluation

### 11.1 Minimum Trust Threshold

The publication requirements define the minimum trust threshold:
- **Identity**: Name + bar association = "we know who you are and where you're registered"
- **Biography**: 200+ chars = "you've described your background"
- **Legal expertise**: At least 1 domain = "we know what you do"
- **Consultation offer**: Title + description + price + modality = "clients know what they're getting"

This is a credible minimum. A visitor seeing a profile with name, bar association, bio, domain, and a clear consultation offer with price would have enough information to decide whether to book.

### 11.2 Does the Current Flow Communicate This?

**No.** The current flow:
- Does not explain that bar association is a trust signal
- Does not explain that bio is a trust requirement
- Does not mention verification at all (which is correct — verification is V1)
- Does not explain that a complete consultation offer builds client confidence
- The success screen mentions verification ("Notre equipe verifiera vos informations") which **contradicts** the publication ≠ verification principle

### 11.3 Reinforcements

- Add contextual hints: "Votre barneau est un signal de confiance pour les clients"
- Add bio guidance: "Une biographie de 200 caracteres minimum rassure les clients sur votre parcours"
- Remove verification mention from success screen (it's V1, not MVP)
- Add trust indicators in the preview card: show bar association name
- Post-publication: show "Profile Completion" score with trust-boosting suggestions

### 11.4 Verification as Future Concept

The success screen currently says: "Notre equipe verifiera vos informations avant la publication de votre profil."

This is **incorrect** under the new philosophy. Publication does not require verification. The success screen should say:

> "Your profile is now published. In a future update, you'll be able to submit documents to receive a Verified Professional badge."

---

## 12. Marketplace Readiness Assessment

### 12.1 Is the Minimum Publishable Profile Credible?

**Yes, with caveats.** A profile with:
- Name + bar association + bio (200+ chars)
- At least 1 legal domain
- Consultation title + description + price + modality

...is credible enough for a visitor to assess the professional and decide whether to book. The bio provides narrative, the domain provides relevance, and the offer provides transparency.

### 12.2 Which Optional Fields Most Impact Perceived Quality?

| Optional field | Impact on perceived quality | Priority |
|----------------|---------------------------|----------|
| Professional photo | **High** — humanizes the profile, creates first impression | Encourage strongly |
| Additional domains | Medium — shows breadth of expertise | Encourage |
| Legal situations | **High** — "they handle my specific problem" | Encourage strongly |
| Languages | Medium — accessibility signal | Encourage |
| Professional title | Low — nice to have | Optional |
| Office information | Low for MVP — future feature | Defer |

### 12.3 Information Currently Missing That Will Matter Later

| Missing info | When it matters | Impact |
|-------------|----------------|--------|
| City / office location | Marketplace search & filtering | **High** — visitors search by city |
| Contact information | Post-booking communication | Medium — handled by platform |
| Education | Profile credibility | Low for MVP |
| Experience | Profile credibility | Low for MVP |
| Reviews / ratings | Social proof | Post-MVP (EP-08) |
| Response time | Trust signal | Future — requires data |
| Consultation count | Social proof | Future — requires data |

**Critical gap**: City/office location is not collected in onboarding but will be essential for marketplace search. This should be added as an optional field in the profile or as a future enrichment step.

---

## 13. Progressive Completion Model

### 13.1 Current Model

The backend tracks 10 internal completion sections: identity, biography, contact, office, expertise, offer, education, experience, certifications, memberships. The frontend stepper shows 3 steps: Profil, Expertise, Offre.

This creates a **disconnect**: the user sees 3 steps but the system tracks 10 sections. After completing the 3 onboarding steps, the user sees "configured" but the internal model may show ~30% completion.

### 13.2 Proposed Two-Track Model

**Track 1: Publication Readiness (pre-publication)**

Tracks only mandatory publication requirements:

| Requirement | Weight |
|-------------|--------|
| First name | 11% |
| Last name | 11% |
| Bar association | 11% |
| Biography (200+ chars) | 11% |
| At least 1 legal domain | 11% |
| Consultation title | 11% |
| Consultation description | 11% |
| Consultation price | 11% |
| At least 1 modality | 12% |

When Publication Readiness reaches 100%, the "Publish Profile" button becomes available.

**Track 2: Profile Completion (post-publication)**

After publication, the indicator evolves to track overall profile richness:

| Category | Weight |
|----------|--------|
| Publication requirements | Already 100% |
| Professional photo | +10% |
| Additional domains | +5% |
| Legal situations | +10% |
| Languages | +5% |
| Office information | +10% |
| Contact information | +10% |
| Education | +10% |
| Experience | +10% |
| Certifications | +10% |
| Memberships | +10% |

This model communicates: "Your profile is published. You're at 100% publication readiness but 45% profile completion. Add a photo and legal situations to increase visibility."

### 13.3 Internal Model vs UX Model

The 10-section internal model should remain for backend tracking. The UX-facing model should be the two-track system above. The internal model and the UX model do not need to be identical.

### 13.4 How Completion % Should Work with Optional Fields

- **Pre-publication**: Only mandatory fields count. Optional fields do not increase Publication Readiness %.
- **Post-publication**: Optional fields increase Profile Completion %. This encourages enrichment without blocking publication.
- **Visual distinction**: Mandatory items show checkmarks. Optional items show "+" indicators (additive, not blocking).

---

## 14. Onboarding Flow Review

| Criterion | Assessment | Score |
|-----------|------------|-------|
| **Navigation** | Sidebar + stepper work, but no back button in the flow itself. Can navigate via sidebar but no "retour" CTA. No unsaved changes warning. | 5/10 |
| **Progress** | Stepper shows 3 steps clearly. But no Publication Readiness %. No indication of what's needed to publish. No completion percentage. | 4/10 |
| **Consistency** | Design system is consistent: colors, spacing, typography, component patterns, card styling, sticky action bar. All pages follow the same layout. | 8/10 |
| **Terminology** | Good use of French legal terms. "Situations que vous traitez" is excellent. "Offre de consultation" is clear. But "configuration" should be "publication". | 7/10 |
| **CTA wording** | "Enregistrer et continuer" is clear. "Terminer la configuration" should become "Publier mon profil". No secondary "Sauvegarder et rester" option. | 5/10 |
| **Empty states** | Only expertise page has a proper empty state (situations block with dashed border + icon + text). Profile and offer pages don't need them (forms). | 7/10 |
| **Success states** | Offer page has a success screen — good. But it says "configure" not "published", mentions verification (incorrect for MVP), and has a disabled "Bientot" button. No enrichment prompts. | 3/10 |
| **Validation** | Minimal. Profile: only first+last name required. Expertise: all 3 blocks required (should be 1 domain only). Offer: price > 0 + 1 modality (missing title/description). No field-level error messages. No inline validation. | 3/10 |
| **Responsiveness** | Grid layouts use sm: and lg: breakpoints. But sidebar is always visible (no mobile drawer). On mobile, sidebar takes ~240px of screen width. Sticky action bar works. Offer page grid collapses to single column on mobile. | 5/10 |
| **Accessibility** | Good ARIA: role="checkbox", aria-checked, aria-current="step", aria-label on buttons. Focus rings present. But no aria-live for dynamic status messages. Image upload alt text is empty. No keyboard navigation for the stepper. | 6/10 |

---

## 15. Prioritized Improvements

### Critical (must fix before F-04)

1. **Add consultation title and description fields to the offer page**
   - These are mandatory for publication but are not collected
   - The API contract (`PublicOfferResponse`) already includes `title` and `description`
   - Without these, no profile can be published

2. **Remove consultation duration entirely**
   - The `SegmentedControl` with 15/30/45/60 min should be removed
   - Duration is no longer a product concept
   - Remove from form, preview card, and API payloads

3. **Change modalities from VIDEO/OFFICE to VIDEO/AUDIO/CHAT**
   - Current: `ToggleCard` for "Videoconference" and "Cabinet"
   - Required: `ToggleCard` for "Video", "Audio", "Chat"
   - Update the `ConsultationModality` enum, form, preview card, and API

4. **Make bar association mandatory on the profile page**
   - Add `required` prop to `ProSelect` for bar association
   - Update `canContinue` logic to include bar association

5. **Add 200-character minimum to biography**
   - Add inline validation showing character count vs. 200-char minimum
   - Update `canContinue` logic to require bio.length >= 200

6. **Change expertise page validation to only require 1 domain**
   - Remove the requirement for at least 1 practice area and 1 language
   - Update `canContinue` to only check `specs.size > 0`
   - Mark situations and languages sections as optional in the UI

7. **Add loading skeletons to all three pages**
   - Currently, forms show empty fields while data loads from the API
   - Add skeleton states for cards, inputs, and toggle cards

8. **Fix mobile sidebar**
   - Add a hamburger menu / drawer for mobile
   - Hide sidebar by default on screens < 768px

9. **Fix success screen**
   - Remove verification mention (publication does not require verification)
   - Replace "configure" language with "published"
   - Replace disabled "Bientot" button with enrichment prompts
   - Add "Add a photo", "Add more domains", "Add languages" CTAs

### Important (should fix before F-04)

10. **Add Publication Readiness indicator**
    - Replace or augment the 3-step stepper with a Publication Readiness %
    - Show which mandatory requirements are completed vs. missing
    - Make the "Publish Profile" button available at 100%

11. **Add inline validation with error messages**
    - Currently validation is binary (button disabled/enabled)
    - Add field-level error messages: "La biographie doit contenir au moins 200 caracteres"
    - Show errors on blur, not on every keystroke

12. **Remove or hide "Bientot" sidebar items during onboarding**
    - Showing Dashboard, Disponibilites, Publication during onboarding creates confusion
    - Either hide them entirely or move them to a collapsed "A venir" section

13. **Add visual distinction between mandatory and optional fields**
    - Mandatory fields: red asterisk (already on name fields) + "Obligatoire pour la publication" hint
    - Optional fields: "Optionnel" label or subtle visual treatment

14. **Reorder profile page: mandatory fields first**
    - Move name fields before photo upload
    - Move bar association before professional title
    - Signal that mandatory fields are the priority

15. **Add "Save and stay" secondary CTA**
    - Some lawyers may want to save without advancing
    - Add a secondary button: "Enregistrer" (save without navigation)

16. **Add unsaved changes warning**
    - If `isDirty` and the user navigates away, show a confirmation dialog
    - "Vous avez des modifications non enregistrees. Voulez-vous vraiment quitter cette page?"

17. **Update offer page CTA to "Publier mon profil"**
    - When all publication requirements are met, change CTA from "Terminer la configuration" to "Publier mon profil"
    - This reinforces the publication goal

18. **Add contextual trust hints**
    - Near bar association: "Votre barneau est un signal de confiance pour les clients"
    - Near bio: "Une biographie de 200 caracteres minimum rassure les clients sur votre parcours"
    - Near consultation offer: "Un titre et une description clairs augmentent vos chances de reservation"

### Nice to Have (can defer to F-04 or later)

19. **Add search/filter to specializations list**
    - With 18 domains, the grid is manageable, but search would help if the list grows

20. **Add guidance on recommended selections**
    - "Selectionnez 2 a 5 domaines pour une visibilite optimale"

21. **Add bio writing guidance**
    - "Presentez votre approche, vos succes notables, ce qui vous distingue" instead of just "Decrivez votre experience"

22. **Add price range guidance**
    - "La moyenne pour votre specialite est de X DH"

23. **Autosave**
    - Save form changes automatically with a "Enregistre" indicator

24. **Profile strength indicator (post-publication)**
    - Beyond completion %, show trust signals: photo, bar, bio length, expertise breadth

25. **Photo guidance overlay**
    - Show examples of good professional photos

26. **Multilingual onboarding**
    - UI is French-only; Arabic (RTL) and English should be planned

27. **Progressive disclosure on expertise page**
    - Collapse languages section until at least 1 domain is selected

28. **Add "Passer cette etape" on expertise page**
    - Allow skipping expertise entirely if the lawyer wants to publish with just profile + offer
    - But still require at least 1 domain — so this would be "Selectionner un domaine et continuer"

---

## 16. Conclusion

### 16.1 What is Already Working Well

- **Design system consistency** — colors, typography, spacing, border radius, shadows are uniform across all pages. The teal palette is professional and distinctive.
- **Expertise page UX** — the cascading specialization to situation selection with "Tout selectionner" / count display is well-designed. The empty state for situations is good. The header copy is the best in the onboarding.
- **Offer preview card** — real-time preview of what clients will see is a strong product feature that builds confidence and sets Chaweer apart from traditional directories.
- **Sticky action bar pattern** — consistent status + CTA at the bottom of every page provides clear feedback and action.
- **Terminology** — "Situations que vous traitez" instead of "domaines du droit" is excellent product thinking that aligns with the marketplace vision.
- **Accessibility foundations** — ARIA roles, focus rings, semantic HTML are present.
- **Component architecture** — reusable components (Card, ProInput, ProSelect, ProTextarea, ToggleCard, Chip, SegmentedControl) provide a solid foundation.

### 16.2 What Absolutely Needs to Improve Before F-04

1. **Add consultation title and description** (mandatory fields missing)
2. **Remove duration, change modalities to VIDEO/AUDIO/CHAT**
3. **Make bar association mandatory, add bio 200-char minimum**
4. **Change expertise validation to only require 1 domain**
5. **Fix success screen** (remove verification mention, add publication + enrichment)
6. **Add loading skeletons**
7. **Fix mobile sidebar**
8. **Add Publication Readiness indicator**

### 16.3 Overall Product Maturity Score

**6.5 / 10**

The onboarding is structurally sound and visually polished, but it's a form-filling experience, not a publication-oriented journey. The design system is strong, the expertise page is genuinely well-designed, and the offer preview is a nice touch. However:

- The current onboarding does not optimize for the publication KPI (-1.5)
- Missing mandatory fields (title, description) make publication impossible (-1)
- Optional fields block advancement, contradicting the publish-fast philosophy (-0.5)
- No Publication Readiness indicator or publish button (-0.5)
- Success screen undermines the journey with "Bientot" and incorrect verification messaging (-0.5)

### 16.4 Readiness to Continue Development

**Ready to continue with F-04, with the 8 critical improvements implemented first.**

F-04 (Public Professional Profile) will depend on the data collected during onboarding. The missing consultation title/description, wrong modalities, and incorrect validation logic will directly impact the quality of the public profile. These must be addressed before or during the early stages of F-04.

The Publication Readiness concept should be introduced as part of the onboarding improvements, as it will also be relevant to the public profile (showing "verified" vs "unverified" status, for example).

The 10-section internal completion model is fine for backend tracking but needs the two-track UX model (Publication Readiness → Profile Completion) to avoid the disconnect between "onboarding complete" and "profile ready to publish".

---

## 17. Product Success Metrics

These KPIs define how the success of the Professional Workspace onboarding and the marketplace will be measured. They are separated into four categories aligned with the user journey.

### 17.1 Activation

| KPI | Definition | Why it matters |
|-----|-----------|----------------|
| Registration → Onboarding started | % of registered professionals who land on the first onboarding page | Measures the friction of the registration-to-onboarding transition. A drop here means the registration flow or redirect is broken. |
| Onboarding started → Profile published | % of professionals who start onboarding and successfully publish their profile | **The primary KPI.** This is the conversion rate of the entire onboarding. If this is low, the onboarding is too long, too confusing, or too demanding. |

### 17.2 Publication

| KPI | Definition | Why it matters |
|-----|-----------|----------------|
| Publication rate | Number of profiles published per week / month | Measures the supply growth of the marketplace. The lifeblood of a marketplace. |
| Average time to publish | Time from first onboarding page visit to successful publication | Measures onboarding efficiency. Target: under 10 minutes for a prepared lawyer. If this is high, the onboarding has too much friction. |
| Abandonment rate by step | % of users who abandon at each onboarding step (profile, expertise, offer) | Identifies which step causes the most drop-off. The step with the highest abandonment is the step that needs the most attention. |

### 17.3 Marketplace Quality

| KPI | Definition | Why it matters |
|-----|-----------|----------------|
| Profiles with photo | % of published profiles that have a professional photo | Photos humanize the profile and significantly impact first impressions. Low rates suggest the photo upload UX needs improvement or the encouragement prompts aren't working. |
| Profiles with bio > 200 chars | % of published profiles with a biography exceeding the 200-char minimum | Measures whether lawyers are writing meaningful bios or just barely passing the threshold. Low rates suggest the bio guidance needs improvement. |
| Average number of legal domains | Average number of legal practice domains selected per published profile | Measures expertise breadth. Higher numbers improve marketplace matching but may indicate over-selection if too high. |
| Average completion after publication | Average Profile Completion % at 7 days, 30 days, 90 days after publication | Measures whether the progressive enrichment strategy is working. If completion stays at the publication baseline, the enrichment prompts aren't effective. |

### 17.4 Marketplace Performance

| KPI | Definition | Why it matters |
|-----|-----------|----------------|
| Profile views | Number of times a professional's public profile is viewed | Measures marketplace visibility. Low views suggest SEO issues or low marketplace traffic. |
| Booking rate | % of profile views that result in a consultation booking | Measures profile conversion. Low rates suggest the profile isn't convincing enough or the booking flow has friction. |
| Conversion visitor → consultation | % of marketplace visitors who book a consultation | The ultimate marketplace KPI. Measures the end-to-end funnel from discovery to booking. |
| Response rate | % of booking requests that receive a response from the professional | Measures professional engagement. Low response rates damage marketplace trust. |
| Response time | Average time from booking request to professional response | Measures professional responsiveness. Fast responses increase conversion and satisfaction. |

---

## 18. MVP Scope

### 18.1 MVP — Indispensable Features

| Feature | Status | Notes |
|---------|--------|-------|
| Professional registration | Done | Email/password + Google OAuth |
| Professional profile (identity) | Done | Name, photo (optional), title (optional), bar association |
| Biography | Done, needs 200-char minimum | Mandatory for publication |
| Legal practice domains | Done, needs validation change | At least 1 mandatory, 18 domains available |
| Legal situations | Done, needs to become optional | Cascading from selected domains |
| Languages | Done, needs to become optional | Optional enrichment |
| Consultation offer (title, description, price) | **Missing title + description** | Mandatory for publication |
| Consultation modalities (video, audio, chat) | **Wrong modalities** | Must replace VIDEO/OFFICE |
| Publication Readiness indicator | **Not implemented** | Central UX concept |
| Publish Profile button | **Not implemented** | With missing-requirements guidance |
| Profile publication | **Not implemented** | Profile status: DRAFT → PUBLISHED |
| Post-publication enrichment prompts | **Not implemented** | Encourages profile enrichment |
| Professional sidebar | Done, needs mobile fix | Hide "Bientot" items during onboarding |
| Onboarding stepper | Done, needs rethinking | Augment with Publication Readiness |
| Offer preview card | Done, needs title/description | Real-time client-facing preview |

### 18.2 Post-MVP — Future Features

| Feature | Target version | Dependencies |
|---------|---------------|--------------|
| Verified Professional badge | V1 (F-07) | Document submission, admin review |
| Reviews & ratings | F-08 | Completed consultations |
| Availability management | F-06 | Calendar integration |
| Calendar / scheduling | F-06 | Availability, timezone handling |
| Response time tracking | Post-MVP | Requires booking data |
| Consultation count | Post-MVP | Requires completed consultations |
| Office information | Post-MVP | Optional enrichment |
| Professional experience | Post-MVP | Optional enrichment |
| Education | Post-MVP | Optional enrichment |
| Certifications | Post-MVP | Optional enrichment |
| Memberships | Post-MVP | Optional enrichment |
| Publications / articles | Post-MVP | Content management |
| AI-powered recommendations | EP-12 | Requires marketplace data |
| Multi-offer support | Future | Currently single offer only |
| Multilingual onboarding (Arabic RTL, English) | Future | i18n infrastructure |

---

## 19. Roadmap Alignment

This document is not an isolated review. It is a product reference that connects the completed F-03 to the future roadmap. Each step below shows how the work progresses from this review to the long-term vision.

### F-03 — Frontend Review (this document)

- **Objective**: Audit the Professional Workspace onboarding from a product perspective and identify improvements before continuing development.
- **Dependencies**: F-03 implementation (PR-1 through PR-4) must be complete.
- **Expected result**: A prioritized list of improvements (Critical / Important / Nice to have) and a product philosophy document that serves as the source of truth for all future decisions.

### F-03 Fix — Critical Improvements

- **Objective**: Implement the 9 critical improvements identified in this review.
- **Dependencies**: This review document must be approved.
- **Expected result**: Onboarding aligned with the Publication Readiness philosophy. All mandatory fields collected. Duration removed. Modalities corrected. Validation fixed. Loading states added. Mobile sidebar fixed. Success screen redesigned.

### F-04 — Public Professional Profile

- **Objective**: Design and build the public-facing profile page that visitors see before booking a consultation.
- **Dependencies**: F-03 Fix must be complete (the public profile depends on the data collected during onboarding).
- **Expected result**: A public profile page that displays all published information (identity, bio, domains, situations, offer, modalities) with clear CTAs for booking. Must handle missing optional fields gracefully (initials fallback, omitted sections).

### F-05 — Marketplace

- **Objective**: Build the public marketplace where visitors search, filter, and discover professionals.
- **Dependencies**: F-04 must be complete (marketplace cards link to public profiles). Sufficient published profiles must exist.
- **Expected result**: A search and discovery experience with filters (domain, city, price, modality), professional cards, and AI-assisted search.

### F-06 — Booking

- **Objective**: Build the consultation booking flow.
- **Dependencies**: F-04 (public profile) and F-05 (marketplace) must be complete. Consultation modalities (video, audio, chat) must be defined.
- **Expected result**: A visitor can select a consultation, choose a modality, and book a time slot. The professional receives the booking request and can confirm or decline.

### F-07 — Verification

- **Objective**: Build the professional verification process.
- **Dependencies**: F-03 Fix (publication system) must be complete. Admin interface must exist.
- **Expected result**: Professionals can submit supporting documents. Admins can review and approve/reject. Verified profiles receive a "Verified Professional" badge. Publication is never blocked by verification.

### F-08 — Reviews

- **Objective**: Build the review and rating system.
- **Dependencies**: F-06 (booking) must be complete. Only completed consultations can be reviewed.
- **Expected result**: Clients can leave reviews after consultations. Reviews appear on the public profile. Average rating is displayed on marketplace cards.

---

## 20. Future Review Checklist

This checklist must be used during every future product audit, feature review, or UX evaluation related to the Professional Workspace or Marketplace.

### Product Philosophy

- [ ] Respects Publication Readiness concept (mandatory vs optional separation)
- [ ] Respects Publish Fast principle (no unnecessary friction toward publication)
- [ ] No optional field blocks publication
- [ ] Every mandatory field increases visitor trust
- [ ] Every optional field increases profile visibility
- [ ] Information requests are explained (why we ask)

### UX Quality

- [ ] CTAs are coherent and aligned with the publication goal
- [ ] Loading states exist on all async pages
- [ ] Error messages are explicit and actionable
- [ ] Empty states are designed (not accidental)
- [ ] Success states guide toward next steps (not dead ends)
- [ ] Forms have inline validation with clear error messages
- [ ] Unsaved changes are warned before navigation

### Design & Accessibility

- [ ] Mobile-first approach (sidebar, layouts, forms work on mobile)
- [ ] Accessible (ARIA roles, keyboard navigation, focus management, alt text)
- [ ] Design system consistency (colors, typography, spacing, components)
- [ ] Responsive across breakpoints (mobile, tablet, desktop)

### Product Alignment

- [ ] Compatible with marketplace vision (public profile, search, booking)
- [ ] Compatible with future verification (publication ≠ verification)
- [ ] Terminology is consistent across the product
- [ ] No mandatory field exists without a trust justification
- [ ] Progressive enrichment is encouraged post-publication
- [ ] Profile Completion % is shown after publication
- [ ] Publication Readiness % is shown before publication

---

## Appendix: Legal Domains & Situations Taxonomy

18 domains with their respective situations. At least 1 domain is mandatory for publication.

| Domain | Situations |
|--------|-----------|
| Droit du travail | Licenciement, Litige salarial, Harcelement au travail, Contrat de travail, Rupture conventionnelle, Accident du travail |
| Droit de la famille | Divorce, Garde d'enfants, Pension alimentaire, Succession, Mariage, Reconnaissance de paternite |
| Droit penal | Garde a vue / audition libre, Plainte penale, Defense penale, Violences et agressions, Vol/escroquerie/abus de confiance, Infractions routieres delictuelles |
| Droit des affaires / commercial | Creation d'entreprise, Contrats commerciaux, Recouvrement de creances, Litige entre associes, Procedures collectives, Concurrence deloyale, Baux commerciaux |
| Droit immobilier | Vente immobilere, Bail d'habitation, Copropriete, Construction et malfacons, Expropriation, Troubles de voisinage |
| Droit fiscal | Controle fiscal, Contentieux fiscal, Fiscalite des particuliers, Fiscalite des entreprises, Redressement fiscal |
| Droit administratif | Recours contre une decision administrative, Marches publics, Urbanisme, Fonction publique, Contentieux avec une collectivite |
| Droit de la consommation | Litige avec un vendeur, Credit a la consommation, Vices caches, Demarchage et vente a distance, Litiges e-commerce |
| Droit des etrangers / immigration | Titre de sejour, Naturalisation, Regroupement familial, Recours contre une OQTF, Demande d'asile |
| Droit de la sante | Erreur medicale, Litige avec un etablissement de sante, Droits des patients, Responsabilite des professionnels de sante |
| Propriete intellectuelle | Depot de marque ou brevet, Contrefacon, Droits d'auteur, Contrats de licence |
| Droit des assurances | Refus d'indemnisation, Sinistre auto ou habitation, Assurance vie et prevoyance, Responsabilite civile |
| Droit routier | Retrait ou suspension de permis, Contestation d'amende, Accident de la route, Conduite sous l'emprise d'alcool ou de stupefiants |
| Droit des societes | Constitution de societe, Pacte d'associes, Cession de parts ou d'actions, Gouvernance et direction |
| Droit bancaire et financier | Litige bancaire, Credit immobilier, Surendettement, Fraude bancaire |
| Droit du numerique et des donnees personnelles | RGPD et protection des donnees, Cybercriminalite, Litiges e-commerce et plateformes, Diffamation et injure en ligne |
| Droit de l'environnement | Pollution et nuisances, Installations classees (ICPE), Droit rural et agricole |
| Droit des transports | Litige de transport de marchandises, Accident de transport, Contentieux avec un transporteur |

---

## 21. Product Glossary

This glossary provides a single, authoritative definition for every concept used in this document. It ensures that Product, UX, Frontend, and Backend teams share the same understanding.

| Concept | Definition |
|---------|-----------|
| **Publication Readiness** | The percentage of mandatory publication requirements that have been completed. When Publication Readiness reaches 100%, the profile can be published. This is a pre-publication metric only. |
| **Profile Completion** | The overall richness of a profile, including both mandatory and optional fields. This metric replaces Publication Readiness after publication and encourages progressive enrichment. A published profile starts at a baseline and increases as optional fields are completed. |
| **Published Profile** | A professional profile whose status is PUBLISHED. It is visible on the marketplace, has a public URL, and appears in search results. All mandatory publication requirements must be satisfied. |
| **Verified Professional** | A professional who has submitted supporting documents and been validated by the Chaweer team. Receives a "Verified Professional" badge on their public profile. Verification is independent from publication and is introduced in V1 (F-07). |
| **Verification** | An independent process where professionals submit documents (bar card, ID, etc.) for review by the Chaweer team. Verification does NOT affect publication. A profile can be published without being verified. |
| **Legal Domain** | A broad area of legal practice (e.g., Droit du travail, Droit de la famille). There are 18 domains in the taxonomy. At least 1 domain is mandatory for publication. Domains enable marketplace search and AI matching. |
| **Legal Situation** | A specific legal problem within a domain (e.g., Licenciement within Droit du travail). Situations are cascaded from selected domains. Situations are optional for publication but strongly recommended for marketplace visibility. |
| **Consultation Offer** | The single consultation service defined by the professional. Includes a title, description, price, and at least one modality (video, audio, chat). The MVP supports only one offer per professional. Duration has been removed from the product. |
| **Marketplace Visibility** | The state of being discoverable by citizens on the public marketplace. A profile has marketplace visibility only when its status is PUBLISHED. Unpublished profiles are invisible to the marketplace. |
| **Trust Signal** | Any piece of information on a profile that increases a visitor's confidence in the professional. Mandatory fields (name, bar association, bio, domain, offer) are minimum trust signals. Optional fields (photo, additional domains, situations) are enrichment trust signals. |
| **Mandatory Field** | A field that must be completed before the profile can be published. Mandatory fields are publication requirements. Each one must increase visitor trust (Principle P3). |
| **Optional Field** | A field that can be left empty without blocking publication. Optional fields increase Profile Completion and marketplace visibility but do not affect Publication Readiness. |
| **Future Enrichment** | A profile section or field that is not part of the MVP. These include education, experience, certifications, memberships, publications, and availability. They are introduced in future iterations and never block publication. |
| **Publication Requirement** | A specific mandatory condition that must be satisfied for the profile to be published. The complete list: first name, last name, bar association, biography (200+ chars), at least 1 legal domain, consultation title, consultation description, consultation price, at least 1 consultation modality. |
| **Product KPI** | A metric used to measure the success of the product. The primary KPI for onboarding is: onboarding started → profile published. Secondary KPIs include publication rate, time to publish, and abandonment rate by step. |
| **Onboarding** | The process by which a registered professional completes the minimum information required to publish their profile. Onboarding is not profile completion — it is the shortest path to publication. |
| **Marketplace** | The public-facing platform where citizens search, discover, and book legal professionals. The marketplace only displays published profiles. Marketplace features include search, filtering, and AI-assisted recommendations (future). |
| **Progressive Enrichment** | The post-publication experience where the professional is encouraged to complete optional fields to increase their Profile Completion % and marketplace visibility. Enrichment is always optional and never unpublishes a profile. |

---

## 22. Product Decision Log

This section records the key product decisions taken in this document. Each decision includes its rationale and expected impact. This log serves as the authoritative reference for why the product is designed the way it is.

| Decision | Rationale | Expected Impact | Status |
|----------|-----------|-----------------|--------|
| **Publication ≠ Verification** | Decoupling publication from verification allows lawyers to publish immediately without waiting for document review. This removes the biggest friction barrier (admin approval) from the onboarding critical path. | Faster time-to-publish. Higher publication rates. Verification becomes a value-add (badge), not a gate. Marketplace has supply sooner. | Approved |
| **Publication Readiness as central concept** | Replaces "profile completion" as the onboarding north star. A profile at 40% completion can be 100% publication-ready. This reframes the onboarding from "fill everything" to "publish as fast as possible." | Lawyers understand what's needed to publish. Clearer UX with a progress indicator. Reduced abandonment from unnecessary fields. | Approved |
| **Profile Completion as post-publication metric** | After publication, the indicator evolves to track overall profile richness. This encourages enrichment without re-introducing friction. | Lawyers continue improving their profiles post-publication. Marketplace quality increases over time. Progressive enrichment becomes a natural habit. | Approved |
| **Bio minimum 200 characters** | A bio shorter than 200 characters does not provide enough narrative for a visitor to assess the professional. 200 chars is the minimum viable trust signal for the biography. | Visitors get meaningful bios. Lawyers are guided to write substantive descriptions. Reduces low-effort profiles on the marketplace. | Approved |
| **Removal of consultation duration** | The platform provides a single consultation service. Duration is no longer a product concept. Removing it eliminates a field that added friction without adding value. | Shorter onboarding. Cleaner offer page. No confusion about what the consultation includes. Simplified API and data model. | Approved |
| **Modalities: Video / Audio / Chat** | Replaces Video / Office. Office (in-person) is removed because the MVP focuses on remote consultations. Audio and Chat are added as lower-barrier alternatives for citizens who may not want video. | More accessible consultation options. Broader citizen reach. Matches real-world usage patterns in Morocco. | Approved |
| **Only 1 legal domain mandatory** | Requiring only 1 domain reduces friction while still enabling marketplace matching. Additional domains, situations, and languages are optional enrichment. | Faster onboarding for specialists. Lawyers with broad expertise can still add more domains post-publication. Marketplace matching works with minimum data. | Approved |
| **Languages optional** | Languages are an accessibility signal, not a trust signal. A lawyer can publish without specifying languages — the default assumption is Arabic and French. | Reduced friction. No artificial gate. Lawyers can add languages post-publication for increased visibility. | Approved |
| **Photo optional** | A photo humanizes the profile but is not a trust requirement. Initials fallback provides a professional appearance without a photo. Forcing a photo would add upload friction and potential privacy concerns. | No upload barrier during onboarding. Initials fallback maintains visual professionalism. Lawyers can add a photo later for increased visibility. | Approved |
| **Bar association mandatory** | The bar association is the primary legitimacy signal. It tells visitors "this person is a registered lawyer in Morocco." Without it, the profile cannot establish minimum trust. | Every published profile has a verifiable bar affiliation. Visitors can confirm legitimacy. Marketplace can filter by bar association. | Approved |
| **Publication before enrichment** | The onboarding collects only what's needed to publish. Everything else is post-publication enrichment. This is the operationalization of "publish fast, enrich later." | Shortest possible onboarding. Lawyers see value (published profile) quickly. Enrichment is encouraged, not forced. | Approved |
| **Removal of Office modality** | The MVP focuses on remote consultations (video, audio, chat). In-person office consultations require location management, scheduling, and physical presence — all out of MVP scope. | Simplified modalities. No need for office address or location management in MVP. Cleaner data model. | Approved |
| **Addition of consultation title** | A consultation without a title is ambiguous. The title tells the citizen what the consultation is about (e.g., "Consultation juridique en droit du travail"). It is a mandatory trust and clarity signal. | Citizens understand what they're booking. Profiles have clearer offers. Marketplace cards display meaningful titles. | Approved |
| **Addition of consultation description** | The description provides context that the title alone cannot. It explains what the consultation includes, what the professional will cover, and what the citizen should prepare. | Citizens make informed booking decisions. Reduces mismatched expectations. Increases booking conversion. | Approved |
| **Publication Readiness Indicator in UI** | Replaces the 3-step stepper as the primary progress signal. Shows percentage and missing requirements. The publish button is never silently disabled — it shows what's missing. | Lawyers always know what's needed to publish. No confusion from disabled buttons. Goal-oriented UX. Higher publication conversion. | Approved |

---

## 23. Non Goals / Out of Scope

This section explicitly defines what the MVP does NOT attempt to solve. Clarifying non-goals is as important as defining goals — it prevents scope creep and ensures the team stays focused on the publication KPI.

The following features, capabilities, and concepts are explicitly excluded from the MVP. They belong to future phases of the roadmap and must not be introduced during F-03 or F-04.

### 23.1 Verification & Reputation

- **Verification documentaire** — Document submission and admin review for the "Verified Professional" badge. Out of MVP scope because publication must not depend on verification. Introduced in F-07 (Verification).
- **Reviews** — Client reviews and testimonials after consultations. Out of MVP scope because no consultations have occurred yet. Introduced in F-08 (Reviews).
- **Ratings** — Star ratings or numerical scores based on client feedback. Out of MVP scope because they require completed consultations and a review system. Introduced alongside F-08.
- **Reputation score** — A composite score combining reviews, response time, and consultation count. Out of MVP scope because it requires marketplace data that doesn't exist yet. Post-F-08.

### 23.2 Consultation Management

- **Multiple consultation offers** — The MVP supports a single consultation offer per professional. Multiple offers (e.g., "Quick 15-min advice" vs "Full case review") add complexity to the data model, booking flow, and marketplace display. Future iteration after F-06.
- **Multiple offices** — The MVP does not collect office information. Multiple office locations require address management, geolocation, and per-office availability. Post-MVP, as part of office information enrichment.
- **Calendar management** — Calendar integration (Google Calendar, Outlook) for automatic availability sync. Out of MVP scope because availability scheduling itself is not in the MVP. Introduced in F-06 (Booking).
- **Availability scheduling** — Time slot management, timezone handling, and availability calendars. Out of MVP scope because the booking flow is not yet built. Introduced in F-06 (Booking).

### 23.3 AI & Marketplace Intelligence

- **Automatic lawyer recommendation** — AI-powered recommendations matching citizens to lawyers based on their legal situation. Out of MVP scope because it requires a critical mass of published profiles and consultation data. Introduced in EP-12 (AI Features).
- **AI matching** — Semantic matching between citizen problem descriptions and professional expertise. Out of MVP scope for the same reasons as automatic recommendations. Introduced in EP-12.
- **Marketplace ranking optimisation** — Algorithmic ranking of profiles based on completion, reviews, response rate, and other signals. Out of MVP scope because ranking signals don't exist yet. Post-F-08, when enough marketplace data is available.

### 23.4 Engagement & Gamification

- **Gamification** — Badges, streaks, levels, or achievement systems for profile completion. Out of MVP scope because it adds complexity without serving the publication KPI. Future iteration if engagement data warrants it.
- **Loyalty systems** — Rewards for repeat clients or long-tenured professionals. Out of MVP scope because the marketplace doesn't have transaction history yet. Post-F-08.

### 23.5 Professional Tools

- **Professional analytics** — Dashboard showing profile views, booking conversion, search appearances, and other metrics. Out of MVP scope because the professional dashboard itself is marked "Bientot" and analytics require marketplace traffic data. Post-F-05.
- **CRM features** — Client management, case tracking, communication history. Out of MVP scope because Chaweer is a marketplace, not a practice management tool. Not currently on the roadmap.
- **Messaging system** — In-platform messaging between citizens and professionals. Out of MVP scope because communication is handled through the booking flow. Future iteration if the marketplace demands it.

### 23.6 Platform & Operations

- **Internal back-office workflows** — Admin tools for managing professionals, reviewing profiles, handling disputes. Out of MVP scope because the admin interface is minimal. Introduced progressively alongside F-07 (Verification) and F-08 (Reviews).
- **Multi-language support (Arabic RTL, English)** — The MVP is French-only. Arabic (RTL) and English require i18n infrastructure, RTL layout support, and content translation. Future iteration, prioritized after marketplace launch.
