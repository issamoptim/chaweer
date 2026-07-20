# Chaweer — Sprint 03 — Onboarding professionnel — Spec d'implémentation (Devin)

> Périmètre : **web uniquement**. 4 écrans : Inscription professionnelle → Mon profil → Mon expertise → Offre de consultation.
> Design system : identique aux écrans déjà livrés (Mon profil / Sécurité grand public) — Plus Jakarta Sans, teal `#0F766E`.
> Visuels : `visuels/01-inscription-professionnelle.png` · `02-mon-profil-professionnel.png` · `03-mon-expertise.png` · `04-offre-de-consultation.png`.
> Fichiers source (maquettes interactives) : `E031 - Inscription professionnelle.dc.html`, `E032 - Mon profil professionnel.dc.html`, `E033 - Mon expertise.dc.html`, `E034 - Offre de consultation.dc.html`.

---

## 0. Contexte produit (rappel)

Chaweer n'est pas un annuaire d'avocats. Un utilisateur ne cherche pas un avocat : il décrit un problème ("je me fais licencier", "je veux divorcer"). Les avocats configurent les **situations** qu'ils traitent (pas seulement leurs spécialités) pour être proposés au bon moment. **L'écran 3 (Mon expertise) porte cette mécanique — c'est l'écran le plus important du sprint.**

Ce sprint couvre uniquement l'onboarding professionnel. **Hors périmètre : réservation, paiement, consultation vidéo, page de profil public, tableau de bord.**

---

## 1. Tokens (identiques au design system existant)

Vert primaire `#0F766E` · hover `#134E4A` · accent focus `#14B8A6` (anneau `rgba(20,184,166,.35-.40)`).
Fond canvas workspace `#F7F7F5` · fond auth `#F7F7F5` · cartes `#FFFFFF` · bordure carte `#E9E7E3` · séparateur `#EFEDE9`/`#F0EEEA`.
Texte `#1C1B1A` · secondaire `#6B6862` · atténué `#9A968E` · placeholder muted `#B4AFA6`.
Champ : bordure `#E7E5E1`, hauteur 50-52px, radius 12.
Désactivé : fond `#CFD8D6` / texte `#8A9997`. Erreur `#B4231F`.
Badge "Espace professionnel" : texte `#0F766E`, fond `#E6F2F0`, bordure `#CDE5E1`.
Pill "Bientôt" (nav désactivée) : fond `#EEECE8`, texte `#8A8681`.
Police **Plus Jakarta Sans** partout. Cartes radius 16, padding 26, ombre `0 1px 2px rgba(19,78,74,.04), 0 8px 24px rgba(19,78,74,.06)`.

---

## 2. Écran 1 — Inscription professionnelle (`01-inscription-professionnelle.png`)

Page d'authentification pleine page, sans sidebar. Canvas `#F7F7F5`, carte blanche centrée (440px, radius 20, padding 40).

- Logo « Chaweer » + badge « Espace professionnel ».
- Titre « Créer votre compte professionnel » + sous-titre.
- **Bouton Google dominant** (« Continuer avec Google ») — logo Google officiel, en premier, pleine largeur.
- Séparateur « ou ».
- Champs : E-mail professionnel, Mot de passe (avec œil afficher/masquer), Confirmer le mot de passe. Aide sous le mot de passe : « 8 caractères minimum, avec au moins une lettre et un chiffre. »
- CTA primaire pleine largeur « Créer mon compte professionnel » (désactivé/grisé tant que le formulaire n'est pas valide).
- Lien secondaire : « Vous avez déjà un compte ? Se connecter ».
- Pied de page discret : « Vous êtes un particulier ? → Retour à l'espace grand public ».
- Micro-légal : mentions Conditions / Politique de confidentialité.

**Validation :** e-mail obligatoire + format ; mot de passe ≥8 caractères avec une lettre et un chiffre ; confirmation identique. Erreurs sous le champ concerné.
**États :** idle → loading (bouton spinner « Création du compte… », champs désactivés) → succès (panneau de confirmation avec CTA vers l'écran Mon profil).

---

## 3. Ossature commune des écrans 2 à 4 (Espace professionnel)

### Sidebar (240px, repliable à 76px via un bouton chevron)
- Logo « Chaweer » + badge « Espace professionnel » (masqués/réduits en mode replié : logo → monogramme "C").
- Navigation, dans l'ordre :
  1. **Tableau de bord** — désactivé, pill « Bientôt ».
  2. **Mon profil**
  3. **Mon expertise**
  4. **Offre de consultation**
  — séparateur —
  5. **Disponibilités** — désactivé, pill « Bientôt ».
  6. **Publication** — désactivé, pill « Bientôt ».
- Item actif : fond `#E6F2F0`, texte `#0F766E`, gras. Items 2-4 sont cliquables/actifs (navigation entre les 3 écrans) ; 1, 5, 6 sont non cliquables (`cursor:not-allowed`) — **ces 3 items n'ont aucune page derrière et ne doivent pas être implémentés dans ce sprint.**
- Bas de sidebar : avatar + nom de l'avocat + lien « ← Retour au site ».

### Indicateur de progression (haut de contenu, écrans 2-4)
Stepper horizontal à 3 étapes (Profil / Expertise / Offre) avec connecteurs. État par écran : fait (rond plein teal + coche) / en cours (rond contour teal + numéro) / à venir (rond gris + numéro gris). Légende sous le stepper : « Étape X sur 3 — … ».

### Barre d'action sticky (bas de page, hors sidebar)
Présente sur les 3 écrans : à gauche un statut contextuel, à droite un bouton d'action principal (grisé/désactivé tant que la condition de validation n'est pas remplie, teal plein sinon). Chaque écran navigue réellement vers le suivant à la soumission (Profil→Expertise→Offre).

---

## 4. Écran 2 — Mon profil (`02-mon-profil-professionnel.png`)

Titre « Mon profil » + sous-titre. Étape 1/3.

**Carte "Informations personnelles"** : photo de profil (upload circulaire) + aide format carré, puis Prénom / Nom (2 colonnes).
**Carte "Informations professionnelles"** : Barreau (select) / Ville (select) en 2 colonnes ; Téléphone professionnel / Adresse du cabinet en 2 colonnes.
**Carte "Biographie"** : textarea large + compteur de caractères (max indicatif 600).

**Barre sticky :** statut « Modifications non enregistrées » (gris) ↔ « Toutes les modifications sont enregistrées » (teal + coche). Bouton « Enregistrer et continuer → » — grisé tant qu'aucune modification n'a été faite, actif (teal) dès qu'un champ change. Prénom et Nom sont requis pour activer le bouton.

---

## 5. Écran 3 — Mon expertise (`03-mon-expertise.png`) — ÉCRAN CLÉ

Titre « Mon expertise » + sous-titre explicite sur la philosophie produit (l'utilisateur décrit un problème, pas un domaine). Étape 2/3.

**⚠️ Ne pas implémenter cet écran comme un wizard multi-étapes (pas d'écran par étape, pas de "suivant/précédent" bloquant).** Tout tient sur **une seule page**, en 3 blocs verticaux, avec révélation progressive :

**Bloc 1 — "1. Vos spécialités" :** grille de cartes à bascule (8 spécialités : Droit du travail, Droit de la famille, Droit des affaires, Droit immobilier, Droit pénal, Droit des étrangers, Droit fiscal, Droit de la consommation). Carte sélectionnée = bordure + fond teinté teal + coche. Sous le libellé : compteur de situations sélectionnées une fois la spécialité activée (ou « Aucune situation sélectionnée » si 0).

**Bloc 2 — "2. Situations que vous traitez" :** **c'est le cœur de l'écran.** Pour **chaque spécialité sélectionnée** dans le bloc 1 (et uniquement celles-là), afficher une sous-carte dédiée avec :
- son nom + un lien « Tout sélectionner »/« Tout désélectionner » + un compteur « x/y sélectionnées » ;
- une grille de cases à cocher = les situations concrètes de cette spécialité (ex. pour Droit du travail : Licenciement, Litige salarial, Harcèlement au travail, Contrat de travail, Rupture conventionnelle, Accident du travail — la liste complète par spécialité est dans le tableau ci-dessous).
- **État vide** (aucune spécialité choisie) : bloc avec bordure en pointillés, icône, texte « Sélectionnez au moins une spécialité ci-dessus pour configurer les situations associées. »

**Bloc 3 — "3. Langues de consultation" :** chips multi-sélection — Français, العربية, English, Español.

**Barre sticky :** à gauche un résumé live (« 2 spécialités · 5 situations · 2 langues », ou message neutre si incomplet) ; à droite « Enregistrer et continuer → », activé seulement si ≥1 spécialité **ET** ≥1 situation **ET** ≥1 langue sont sélectionnées.

### Référentiel spécialités → situations (à utiliser tel quel)
| Spécialité | Situations |
|---|---|
| Droit du travail | Licenciement · Litige salarial · Harcèlement au travail · Contrat de travail · Rupture conventionnelle · Accident du travail |
| Droit de la famille | Divorce · Garde d'enfants · Pension alimentaire · Succession · Mariage · Reconnaissance de paternité |
| Droit des affaires | Création d'entreprise · Contrats commerciaux · Recouvrement de créances · Litige entre associés |
| Droit immobilier | Achat immobilier · Litige locatif · Copropriété · Permis de construire |
| Droit pénal | Contravention / amende · Garde à vue · Plainte pénale · Défense pénale |
| Droit des étrangers | Titre de séjour · Regroupement familial · Naturalisation |
| Droit fiscal | Contrôle fiscal · Contentieux fiscal · Optimisation fiscale |
| Droit de la consommation | Litige avec un commerçant · Garantie produit · Crédit à la consommation |

---

## 6. Écran 4 — Offre de consultation (`04-offre-de-consultation.png`)

Titre « Offre de consultation » + sous-titre. Étape 3/3 (Profil et Expertise déjà marqués faits).

Layout 2 colonnes : formulaire à gauche, **aperçu client réactif** à droite (sticky), qui se met à jour en direct avec les valeurs saisies (nom, tarif, durée, modalités).

- **Carte "Tarif"** : champ numérique + suffixe « DH » + aide « affiché avant toute prise de rendez-vous — sans surprise ».
- **Carte "Durée"** : sélecteur segmenté 15 / 30 / 45 / 60 minutes (choix unique).
- **Carte "Modalités"** : 2 cartes à bascule multi-sélection — Vidéoconférence / Cabinet (icônes distinctes, ≥1 requis).
- **Aperçu client** (droite) : mini carte type "profil résultats" — avatar, nom, ville, badge Vérifié, spécialités, prix en gros, durée, icônes des modalités actives. Purement illustratif, ne représente pas une page publique réelle.

**Barre sticky finale :** « Terminer la configuration » — activé si tarif > 0 et ≥1 modalité sélectionnée. À la soumission : état de chargement puis **panneau de fin d'onboarding** (« Votre profil professionnel est configuré », mention de la vérification à venir par l'équipe, CTA « Accéder à mon tableau de bord » **désactivé** avec pill « Bientôt » — le tableau de bord n'existe pas encore).

---

## 7. Composants du Design System à réutiliser
Card, Input, Select, Textarea, Password Input (avec œil), Button (primaire/secondaire/désactivé), Toggle Card (spécialités, modalités), Checkbox, Chip (langues), Segmented Control (durée), Stepper, Sidebar Nav Item (actif/inactif/désactivé+pill), Image Upload Slot, Spinner. **Ne créer aucun composant ad hoc en dehors de ceux-ci.**

## 8. Accessibilité (WCAG AA)
Navigation clavier complète, focus visible (`box-shadow:0 0 0 3px rgba(20,184,166,.40)`), labels associés à chaque champ, cases à cocher/chips activables au clavier, contrastes conformes, cibles ≥ 44px, items de navigation désactivés correctement annoncés (`aria-disabled`).

## 9. Hors périmètre (ne pas implémenter)
Tableau de bord, Disponibilités, Publication (jusqu'aux items de nav qui y mènent — garder désactivés), réservation, paiement, consultation vidéo réelle, page de profil public, vérification manuelle (back-office), multi-langue de l'interface (FR uniquement pour ce sprint).
