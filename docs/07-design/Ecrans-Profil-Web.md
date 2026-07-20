# Chaweer — Écrans Profil (US-021 / US-022) — Contexte d'implémentation Web

> Pour Devin. Périmètre : **web uniquement**. Cadre canonique validé : header Chaweer + contenu centré, **sans rail latéral**.
> Source de vérité visuelle : le module d'authentification (mêmes tokens). Deux écrans ici : **Mon profil** (consultation) et **Modifier mon profil** (édition + confirmation).
> Visuels de référence : `visuels/profil-web.png`, `visuels/profil-web-bas.png`, `visuels/edition-web.png`, `visuels/edition-web-bas.png`, `visuels/edition-web-confirmation.png`.

---

## 1. Design tokens (à réutiliser tels quels)

| Rôle | Valeur |
|---|---|
| Vert primaire (marque, CTA, actifs, avatar, toggles ON) | `#0F766E` |
| Vert foncé (hover CTA, toasts) | `#134E4A` |
| Accent (anneau de focus) | `#14B8A6` |
| Fond de page | `#F5F5F3` |
| Fond de carte | `#FFFFFF` |
| Bordure de carte | `#E9E7E3` |
| Séparateur (lignes entre champs) | `#F0EEEA` |
| Texte principal | `#1C1B1A` |
| Texte secondaire | `#6B6862` |
| Texte atténué / label | `#9A968E` |
| Valeur « Non renseigné » | `#B4AFA6` |
| Rouge danger (texte) | `#B4231F` |
| Danger — fond carte | `#FDF3F2` |
| Danger — bordure | `#F3D9D7` |
| Danger — bordure bouton | `#E9C9C7` |
| Champ lecture seule — fond | `#F2F1EF` |
| Bouton désactivé — fond / texte | `#CFD8D6` / `#8A9997` |

**Typographie** : Plus Jakarta Sans (400/500/600/700/800).
- Titre de page (H1) : 28px / 700 / letter-spacing -0.02em
- Titre de carte : 17px / 700
- Label de champ : 13.5px / 600 (`#1C1B1A`) ; label lecture seule : 600 `#6B6862`
- Label de section (Langue, Notifications) : 13px / 500 `#9A968E`
- Valeur / corps : 15px / 500
- Aide : 12.5–13px / `#9A968E`

**Rayons** : cartes & zone danger **16px** · champs, selects, boutons, pills **12px** (pills langue 10px) · toggle **999px** · avatar/rond **50%**.
**Ombre de carte** : `0 1px 2px rgba(19,78,74,.04), 0 8px 24px rgba(19,78,74,.06)`.
**Focus visible (WCAG AA)** sur tout élément interactif : `box-shadow: 0 0 0 3px rgba(20,184,166,.40)` (rouge `rgba(180,35,31,.28)` pour actions destructives).

---

## 2. Ossature commune (les deux écrans)

- **Header** (barre fixe haute) : fond `#FFFFFF`, `border-bottom:1px solid #E9E7E3`, padding `15px 40px`, `space-between`.
  - Gauche : logotype texte « Chaweer » 19px / 800 `#0F766E`.
  - Droite : liens « Avocats » et « Mes rendez-vous » (14px / 500 `#6B6862`) + avatar rond 36px `#0F766E`, initiales blanches « IM » 13.5px / 700.
- **Zone de contenu** : `max-width:760px`, centrée (`margin:0 auto`), padding `40px 24px 64px` (profil) / `32px 24px 64px` (édition), colonne `flex` avec `gap:22px`.
- Cartes = conteneur blanc décrit en §1.

---

## 3. Écran — Mon profil (US-021, consultation)

Ordre vertical : **H1 « Mon profil »** → carte Identité → carte Informations personnelles → carte Préférences → carte Zone de danger.

### 3.1 Carte Identité
Ligne : avatar 64px (`#0F766E`, initiales blanches 22px/700) + bloc texte :
- Nom complet — 19px / 700 (`ISSAM MAJDOUBI`)
- « Compte Grand Public » — 14px / `#6B6862`
- Email — 14px / `#6B6862` (`issam.majdoubi@gec-groupe.com`)

### 3.2 Carte Informations personnelles
- En-tête : titre « Informations personnelles » (17/700) à gauche ; lien **« Modifier mon profil »** à droite (14.5/600, `#1C1B1A`, hover `#0F766E`) → navigue vers US-022.
- Liste de champs, chacun : label (13/500 `#9A968E`) au-dessus, valeur (15/500) en dessous, `padding:16px 0`, `border-bottom:1px solid #F0EEEA`.
- Champs, en lecture seule : **Prénom** (ISSAM), **Nom** (MAJDOUBI), **Email**, **Téléphone** (0708140040), **Pays** (Maroc), **Ville** (`Non renseigné` en `#B4AFA6` si absent), **Nationalité** (Marocaine).
- ⚠️ Consultation stricte : aucune édition ici. L'édition relève de US-022.

### 3.3 Carte Préférences (langue + notifications réunies)
- Titre « Préférences » (17/700).
- Sous-section « Langue de l'interface » (label 13/500 `#9A968E`) → 3 pills : **Français / العربية / English**. Pill active = fond `#0F766E`, texte blanc ; inactive = fond blanc, bordure `#E7E5E1`, texte `#4B4A46`. Hauteur 42px, radius 10px.
- Sous-section « Notifications » → 3 lignes (`space-between`, `padding:15px 0`, séparateur `#F0EEEA`) :
  - **Notifications par e-mail** — toggle ON par défaut
  - **Notifications push** — toggle ON par défaut
  - **Notifications SMS** — pill « Bientôt disponible » (11px, fond `#EEECE8`, texte `#8A8681`) + toggle **désactivé** (non cliquable), libellé en `#9A968E`.
- Toggle : piste 46×28, radius 999 ; ON `#0F766E`, OFF `#D8D5D0`, désactivé `#EDEBE7` ; genou blanc 22px (`left:3px` OFF / `left:21px` ON), transition 180ms. `role="switch"`, `aria-checked`, focusable clavier.

### 3.4 Carte Zone de danger
- Fond `#FDF3F2`, bordure `#F3D9D7`, radius 16, padding 26.
- Titre « Zone de danger » (17/700, `#1C1B1A` — **pas** rouge).
- Texte : « La suppression de votre compte est définitive après 30 jours. Cette action nécessite une réauthentification. » (14/`#6B6862`).
- Bouton **« Supprimer mon compte »** : fond blanc, texte `#B4231F`, bordure `#E9C9C7`, radius 11, hauteur 44 ; hover fond `#FBEAE9`. Discret, jamais un bouton plein rouge.

### 3.5 Interactions & états (Mon profil)
- Changer de langue **ou** basculer un toggle → **toast** « Préférences enregistrées » (fixé en bas centre, fond `#134E4A`, coche accent `#14B8A6`, auto-disparition ~2,4 s, `aria-live=polite`).
- « Supprimer mon compte » → **modale de confirmation** : icône corbeille sur pastille `#FBEAE9`, titre « Supprimer votre compte ? », texte (définitif après 30 jours + réauthentification), boutons **Annuler** (secondaire, par défaut) / **Supprimer définitivement** (`#B4231F`). Échap = annuler. Piège de focus dans la modale.
- États à prévoir côté implémentation : chargement (skeletons de valeurs), champs optionnels vides → « Non renseigné » (jamais de ligne vide), erreur de chargement (carte calme + « Réessayer »).

---

## 4. Écran — Modifier mon profil (US-022, édition + confirmation)

Même ossature. Deux vues gérées par état : **formulaire** et **confirmation**.

### 4.1 Vue formulaire
- Lien retour « ← Retour » (13.5/600 `#0F766E`) → si modifications en attente, ouvre la modale « Quitter sans enregistrer ».
- H1 « Modifier mon profil » + sous-titre « Mettez à jour vos informations personnelles. » (14.5/`#6B6862`).
- **Une carte** contenant les champs (colonne, `gap:20px`) :
  - **Prénom*** — input texte éditable.
  - **Nom*** — input texte éditable ; si vidé au submit → bordure `#B4231F` + message « Le nom est obligatoire. ».
  - **Email** — **lecture seule**, label avec icône cadenas, fond `#F2F1EF`.
  - **Téléphone*** — input texte éditable (obligatoire).
  - **Pays\*** et **Ville\*** — **côte à côte** (grille 2 colonnes, `gap:18px`), selects stylés (chevron custom, `appearance:none`). Ville a un placeholder « Sélectionner une ville ». Sous les deux : aide « La ville dépend du pays sélectionné. ».
  - **Nationalité\*** — select stylé.
  - Champs `*` = obligatoires.
- **Barre d'actions** (alignée à droite, `gap:12px`) : **Annuler** (secondaire) / **Enregistrer les modifications** (primaire).
  - « Enregistrer » **désactivé** (`#CFD8D6`/`#8A9997`) tant qu'aucune modification ; passe en vert dès le 1er changement. Sauvegarde **explicite** (jamais auto).
  - Pendant l'enregistrement : spinner + « Enregistrement… », champs désactivés (fond `#F2F1EF`), anti double-soumission.

### 4.2 Vue confirmation de modification (écran dédié, pas un simple toast)
- Contenu centré (`max-width:520px`), carte blanche, `padding:44px 32px`, centrée.
- Pastille verte 72px `#0F766E` avec coche blanche (animation pop + tracé).
- Titre « Profil mis à jour » (22/700) + « Vos informations ont bien été enregistrées. » (15/`#6B6862`).
- Bouton primaire **« Retour à mon profil »** → US-021.

### 4.3 Modale « Quitter sans enregistrer »
- Déclenchée par Retour/Annuler s'il existe des modifications non enregistrées.
- Titre « Quitter sans enregistrer ? » + texte de perte de données.
- Boutons : **Continuer la modification** (primaire, par défaut) / **Quitter sans enregistrer** (secondaire). Échap = continuer.

### 4.4 États à implémenter (récap)
`chargement` (skeleton + champs désactivés) · `prêt` (prérempli, Enregistrer désactivé) · `édition` (Enregistrer actif) · `enregistrement` (spinner) · `confirmation` (vue 4.2) · `erreur` (toast « Impossible de mettre à jour votre profil. », formulaire conservé, erreurs sous les champs, focus sur le 1er champ en erreur) · `quitter` (modale 4.3).

---

## 5. Règles métier à respecter (ne pas dévier)

- **Consultation vs édition** : US-021 n'édite rien ; toute modification passe par US-022.
- **Champ non modifiable** : Email uniquement (lié à l'authentification) — lecture seule avec cadenas. Le Téléphone est modifiable.
- **Ville dépend du Pays** : réinitialiser/filtrer la liste des villes au changement de pays.
- **SMS** : toujours « Bientôt disponible » + toggle désactivé (aucune action).
- **Suppression de compte** : définitive après 30 jours, nécessite une réauthentification ; toujours derrière une confirmation explicite.
- **Langue** : détectée automatiquement au 1er chargement, modifiable ; 3 valeurs (fr / ar / en). Prévoir l'arabe en RTL.
- **Accessibilité** : focus visible partout, cibles ≥ 44px, labels liés aux champs, toasts en `aria-live`, contrastes AA.

---

*Fichiers `.dc.html` correspondants dans le projet : `E021 - Mon Profil.dc.html`, `E022 - Modifier mon profil.dc.html`. Ce document + les PNG du dossier `visuels/` suffisent comme contexte d'implémentation web.*
