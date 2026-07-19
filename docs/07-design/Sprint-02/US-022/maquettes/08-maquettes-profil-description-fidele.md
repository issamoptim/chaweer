# Chaweer — Maquettes « Mon profil » & « Modifier mon profil » — Description fidèle

> Description exhaustive des deux maquettes web validées, pour implémentation.
> Cadre canonique : **header Chaweer + contenu centré (760px), sans rail latéral, fond de page blanc.**
> Écrans : **E021 — Mon profil** (consultation) · **E022 — Modifier mon profil** (édition + confirmation).
> Réf. visuelles : `visuels/profil-web.png`, `visuels/profil-web-bas.png`, `visuels/edition-web.png`, `visuels/edition-web-bas.png`, `visuels/edition-web-confirmation.png`.

---

## 1. Palette exacte (couleurs)

| Rôle | Hex |
|---|---|
| Vert primaire — marque, CTA, avatar, pill langue active, toggle ON, pastille succès | `#0F766E` |
| Vert foncé — hover CTA, fond des toasts | `#134E4A` |
| Accent — anneau de focus (`rgba(20,184,166,.40)`) | `#14B8A6` |
| **Fond de page** | `#FFFFFF` (blanc) |
| Fond de carte | `#FFFFFF` |
| Bordure de carte | `#E9E7E3` |
| Séparateur (lignes entre champs / lignes notifications) | `#F0EEEA` |
| Texte principal | `#1C1B1A` |
| Texte secondaire | `#6B6862` |
| Label / texte atténué | `#9A968E` |
| Valeur « Non renseigné » | `#B4AFA6` |
| Champ lecture seule — fond | `#F2F1EF` |
| Champ lecture seule — bordure | `#EAE8E3` |
| Bordure de champ (input/select) | `#E7E5E1` |
| Bouton désactivé — fond / texte | `#CFD8D6` / `#8A9997` |
| Rouge danger — texte / erreur | `#B4231F` |
| Rouge danger — hover destructif | `#8F1B18` |
| Zone de danger — fond carte | `#FDF3F2` |
| Zone de danger — bordure carte | `#F3D9D7` |
| Zone de danger — bordure bouton | `#E9C9C7` |
| Bouton danger hover — fond | `#FBEAE9` |
| Pill « Bientôt disponible » — fond / texte | `#EEECE8` / `#8A8681` |
| Toggle OFF / désactivé — piste | `#D8D5D0` / `#EDEBE7` |

Ombre de carte : `0 1px 2px rgba(19,78,74,.04), 0 8px 24px rgba(19,78,74,.06)`.
Ombre de modale : `0 20px 50px rgba(19,78,74,.24)`. Ombre de toast : `0 10px 28px rgba(19,78,74,.28)`.

---

## 2. Typographie & métriques

Police unique : **Plus Jakarta Sans** (400/500/600/700/800).

| Élément | Taille / graisse | Couleur |
|---|---|---|
| H1 de page | 28px / 700 / -0.02em | `#1C1B1A` |
| Titre de carte | 17px / 700 | `#1C1B1A` |
| Nom (carte identité) | 19px / 700 | `#1C1B1A` |
| Label de champ (édition) | 13.5px / 600 | `#1C1B1A` |
| Label lecture seule | 13.5px / 600 | `#6B6862` |
| Label de champ (consultation) | 13px / 500 | `#9A968E` |
| Label de section (Langue, Notifications) | 13px / 500 | `#9A968E` |
| Valeur / corps / champ | 15px / 500 | `#1C1B1A` |
| Lien « Modifier mon profil » | 14.5px / 600 | `#1C1B1A` → hover `#0F766E` |
| Aide (sous champ) | 12.5px / 400 | `#9A968E` |
| Lien retour | 13.5px / 600 | `#0F766E` |

Rayons : cartes & zone danger **16px** · inputs/selects/boutons **12px** · pills langue **10px** · bouton danger **11px** · toggle **999px** · avatars/pastilles **50%**.
Hauteurs : inputs/selects **50px** · boutons principaux **50px** · bouton danger **44px** · pills langue **42px** · toggle **46×28** (genou 22px) · avatar header **36px** · avatar identité **64px**.
Focus (WCAG AA) sur tout interactif : `box-shadow:0 0 0 3px rgba(20,184,166,.40)` ; destructif : `rgba(180,35,31,.28/.35)`.

---

## 3. Ossature commune

- **Header** : fond blanc, `border-bottom:1px solid #E9E7E3`, padding `15px 40px`, `justify-content:space-between`.
  - Gauche : « Chaweer » 19px/800 `#0F766E`.
  - Droite : « Avocats », « Mes rendez-vous » (14px/500 `#6B6862`) + avatar 36px `#0F766E` initiales blanches « IM » (13.5px/700).
- **Contenu** : `max-width:760px`, `margin:0 auto`, colonne flex `gap:22px`, padding `40px 24px 64px` (profil) / `32px 24px 64px` (édition).
- Cartes = fond blanc, bordure `#E9E7E3`, radius 16, padding 26–28, ombre de carte.

---

## 4. E021 — Mon profil (consultation)

Ordre : **H1 « Mon profil »** → Identité → Informations personnelles → Préférences → Zone de danger.

### 4.1 Carte Identité
Avatar 64px `#0F766E` (initiales blanches 22px/700) + : Nom « ISSAM MAJDOUBI » (19/700) · « Compte Grand Public » (14/`#6B6862`) · « issam.majdoubi@gec-groupe.com » (14/`#6B6862`).

### 4.2 Carte Informations personnelles
- En-tête : titre (17/700) à gauche ; **« Modifier mon profil »** à droite (lien → E022).
- Champs empilés (label 13/500 `#9A968E` au-dessus, valeur 15/500 dessous, `padding:16px 0`, `border-bottom:1px solid #F0EEEA`) : **Prénom** ISSAM · **Nom** MAJDOUBI · **Email** issam.majdoubi@gec-groupe.com · **Téléphone** 0708140040 · **Pays** Maroc · **Ville** `Non renseigné` (couleur `#B4AFA6`) · **Nationalité** Marocaine.
- Lecture seule stricte — aucune édition sur cet écran.

### 4.3 Carte Préférences
- Titre « Préférences ».
- **Langue de l'interface** : 3 pills — **Français / العربية / English**. Active : fond `#0F766E`, texte blanc. Inactive : fond blanc, bordure `#E7E5E1`, texte `#4B4A46`. 42px, radius 10.
- **Notifications** : 3 lignes (`space-between`, `padding:15px 0`, séparateur `#F0EEEA`) :
  - **Notifications par e-mail** — toggle ON.
  - **Notifications push** — toggle ON.
  - **Notifications SMS** + pill « Bientôt disponible » — toggle **désactivé**, libellé `#9A968E`.
- Toggle : piste 46×28 radius 999 ; ON `#0F766E`, OFF `#D8D5D0`, désactivé `#EDEBE7` ; genou blanc 22px `left:3px`(OFF)/`21px`(ON), transition 180ms ; `role="switch"`, `aria-checked`, focusable.

### 4.4 Carte Zone de danger
Fond `#FDF3F2`, bordure `#F3D9D7`, radius 16, padding 26. Titre « Zone de danger » (17/700 `#1C1B1A`). Texte : « La suppression de votre compte est définitive après 30 jours. Cette action nécessite une réauthentification. » Bouton **« Supprimer mon compte »** (blanc, texte `#B4231F`, bordure `#E9C9C7`, 44px, hover fond `#FBEAE9`).

### 4.5 Interactions (E021)
- **Changer de langue** ou **basculer un toggle actif** → **toast** « Préférences enregistrées » : `position:fixed`, bas-centre, fond `#134E4A`, coche sur pastille `#14B8A6`, apparition 280ms, auto-masquage ~2,4 s, `aria-live=polite`.
- **SMS** : non cliquable (curseur `not-allowed`).
- **« Supprimer mon compte »** → **modale** : overlay `rgba(28,27,26,.42)` ; carte blanche radius 16, padding 28 ; icône corbeille sur pastille `#FBEAE9` ; titre « Supprimer votre compte ? » ; texte (définitif après 30 jours + réauthentification) ; boutons **Annuler** (blanc, bordure `#E7E5E1` — action par défaut) / **Supprimer définitivement** (`#B4231F`, hover `#8F1B18`). Échap = Annuler ; focus piégé.
- **Hover** : liens header/nav → `#0F766E` ; lien « Modifier mon profil » → `#0F766E` ; bouton danger → fond `#FBEAE9` bordure `#DBB4B2`.

---

## 5. E022 — Modifier mon profil (édition + confirmation)

Deux vues pilotées par l'état : **formulaire** / **confirmation**. + modale « quitter sans enregistrer ».

### 5.1 Vue formulaire
- **« ← Retour »** (13.5/600 `#0F766E`) → si modifs en attente : ouvre la modale 5.3, sinon revient au profil.
- H1 « Modifier mon profil » + sous-titre « Mettez à jour vos informations personnelles. » (14.5/`#6B6862`).
- **Carte** — champs en colonne `gap:20px` :
  - **Prénom\*** — input éditable (valeur ISSAM).
  - **Nom\*** — input éditable (valeur MAJDOUBI). Vidé au submit → bordure `#B4231F` + « Le nom est obligatoire. » (13/`#B4231F`, icône).
  - **Email** — **lecture seule** (cadenas dans le label, fond `#F2F1EF`, bordure `#EAE8E3`).
  - **Téléphone\*** — **input éditable** (valeur 0708140040). *(modifiable ; aucun texte d'aide.)*
  - **Pays\*** + **Ville\*** — **côte à côte**, grille 2 colonnes `gap:18px`. Selects stylés (`appearance:none`, chevron custom à droite). Ville : placeholder « Sélectionner une ville ». Sous la grille : aide « La ville dépend du pays sélectionné. ».
  - **Nationalité\*** — select stylé (Marocaine / Française / Autre).
- **Actions** (alignées à droite, `gap:12px`) : **Annuler** (blanc, bordure `#E7E5E1`) · **Enregistrer les modifications** (primaire).
  - Enregistrer **désactivé** (`#CFD8D6`/`#8A9997`, `not-allowed`) tant que rien n'a changé ; **vert** dès la 1ʳᵉ modification. Sauvegarde explicite.

### 5.2 Vue confirmation de modification (écran dédié)
Contenu centré `max-width:520px` ; carte blanche padding `44px 32px`, centrée. Pastille 72px `#0F766E` + coche blanche (animations `pop` 400ms + tracé `check` 500ms). Titre « Profil mis à jour » (22/700). Texte « Vos informations ont bien été enregistrées. » (15/`#6B6862`). Bouton **« Retour à mon profil »** (primaire) → E021.

### 5.3 Modale « Quitter sans enregistrer ? »
Déclenchée par Retour/Annuler avec modifs non enregistrées. Titre « Quitter sans enregistrer ? » + texte de perte. Boutons : **Continuer la modification** (primaire, par défaut) / **Quitter sans enregistrer** (blanc). Échap = continuer.

### 5.4 États (E022)
`chargement` (skeletons pulsés, champs désactivés) · `prêt` (prérempli, Enregistrer désactivé) · `édition` (Enregistrer actif) · `enregistrement` (spinner dans le bouton « Enregistrement… », champs désactivés fond `#F2F1EF`, anti double-submit, largeur bouton figée) · `confirmation` (§5.2) · `erreur` (toast rouge « Impossible de mettre à jour votre profil. », formulaire conservé, erreur sous le champ, focus au 1er champ fautif) · `quitter` (§5.3).

### 5.5 Transitions / animations
- Toast : `translate(-50%,8px)→0`, opacité 0→1, 280ms.
- Coche succès : cercle `pop` (scale .8→1.04→1) 400ms ; trait SVG `stroke-dashoffset 24→0` 500ms (retard 150ms).
- Modales : `fade` (translateY 6px→0) 200ms.
- Toggle & selects : couleurs/position 180ms.

---

## 6. Règles métier (invariants)

- **Consultation vs édition** : E021 n'édite rien ; tout passe par E022.
- **Champ non modifiable** : **Email** uniquement (lié à l'authentification) — lecture seule + cadenas. **Téléphone modifiable.**
- **Ville dépend du Pays** : filtrer/réinitialiser au changement de pays.
- **SMS** : toujours « Bientôt disponible » + toggle désactivé.
- **Suppression** : définitive après 30 jours, réauthentification requise, toujours derrière confirmation explicite.
- **Langue** : auto-détectée au 1er chargement, modifiable (fr/ar/en) ; arabe en RTL.
- **A11y** : focus visible partout, cibles ≥ 44px, labels liés, toasts `aria-live`, contrastes AA.

---

*Fichiers : `E021 - Mon Profil.dc.html`, `E022 - Modifier mon profil.dc.html`.*
