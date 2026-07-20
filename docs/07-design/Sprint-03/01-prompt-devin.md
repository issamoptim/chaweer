# Prompt Devin — Sprint 03 — Onboarding professionnel

> À coller dans Devin avec les 4 images du dossier `visuels/` en pièce jointe, ainsi que `00-spec-onboarding-professionnel.md`.

## Images de référence (`visuels/`)
| # | Écran | Fichier |
|---|---|---|
| 1 | Inscription professionnelle | `visuels/01-inscription-professionnelle.png` |
| 2 | Mon profil | `visuels/02-mon-profil-professionnel.png` |
| 3 | Mon expertise (écran clé) | `visuels/03-mon-expertise.png` |
| 4 | Offre de consultation | `visuels/04-offre-de-consultation.png` |

---

## Prompt

Implémente le parcours **Onboarding professionnel** de Chaweer (4 écrans) en te basant **exactement** sur les images fournies et sur `00-spec-onboarding-professionnel.md`. Web, responsive, dans la continuité du design system déjà en place (Plus Jakarta Sans, teal `#0F766E`, cartes blanches, fond `#F7F7F5`).

**Rappel produit important :** Chaweer n'est pas un annuaire d'avocats. Les clients décrivent un problème, pas une catégorie juridique. L'écran « Mon expertise » (image 3) matérialise ça : un avocat sélectionne des spécialités, puis configure précisément les **situations** qu'il traite dans chacune. C'est l'écran le plus important — ne le simplifie pas en une simple liste de cases à cocher plates ni en wizard multi-étapes.

**1. Inscription professionnelle (image 1)** — page d'auth pleine page, sans sidebar. Google en premier et dominant, puis e-mail/mot de passe/confirmation. CTA désactivé tant que le formulaire est invalide. Lien discret vers l'espace grand public.

**2-4. Espace professionnel (images 2, 3, 4)** — sidebar commune 240px (repliable) avec navigation : Tableau de bord (désactivé), Mon profil, Mon expertise, Offre de consultation, puis Disponibilités et Publication (désactivés). **Seuls Mon profil / Mon expertise / Offre de consultation ont une page réelle dans ce sprint** — ne construis pas de pages pour Tableau de bord / Disponibilités / Publication, garde ces items non cliquables avec une pill « Bientôt ». Un stepper 3 étapes en haut de contenu indique la progression (Profil → Expertise → Offre).

**2. Mon profil (image 2)** — carte Informations personnelles (photo + prénom/nom), carte Informations professionnelles (barreau/ville, téléphone/adresse), carte Biographie (textarea + compteur). Barre sticky : bouton "Enregistrer et continuer" grisé jusqu'à la première modification, teal ensuite.

**3. Mon expertise (image 3)** — **une seule page**, 3 blocs :
- Spécialités : grille de cartes à bascule (8 domaines, cf. spec pour la liste exacte).
- Situations : pour **chaque spécialité sélectionnée uniquement**, une sous-carte avec ses situations à cocher (référentiel complet spécialité→situations dans la spec, section 5) + "Tout sélectionner" + compteur. État vide avec message d'invite si aucune spécialité n'est encore choisie.
- Langues : chips multi-sélection (Français, العربية, English, Español).
Barre sticky : résumé live du nombre de spécialités/situations/langues sélectionnées ; bouton de continuation actif seulement si les 3 conditions sont remplies.

**4. Offre de consultation (image 4)** — formulaire (tarif en DH, durée en sélecteur segmenté 15/30/45/60, modalités Vidéo/Cabinet à bascule) à gauche ; aperçu client **réactif** (se met à jour avec les valeurs saisies) à droite. CTA final "Terminer la configuration" → écran de fin avec mention de la vérification à venir et un CTA "Accéder à mon tableau de bord" désactivé (le tableau de bord n'existe pas encore).

**Composants du Design System uniquement** (cf. spec section 7) — ne crée aucun composant ad hoc.

**Accessibilité WCAG AA** : focus visible, navigation clavier, labels associés, contrastes, cibles ≥44px.

**Hors périmètre — ne pas implémenter :** Tableau de bord, Disponibilités, Publication, réservation, paiement, consultation vidéo réelle, page de profil public, back-office de vérification.

Respecte les couleurs, tailles, emplacements et le référentiel spécialités/situations de la spec sans dévier.
