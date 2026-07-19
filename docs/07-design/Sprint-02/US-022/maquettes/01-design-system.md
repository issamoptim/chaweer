# 01 — Design System Chaweer (web)

Source de vérité visuelle. Toute valeur ci-dessous est exacte, tirée des maquettes.

## Couleurs (tokens)

| Token | Hex | Usage |
|---|---|---|
| `--c-primary` | `#0F766E` | CTA e-mail/valider, liens, éléments actifs, sélection |
| `--c-primary-hover` | `#134E4A` | survol des CTA primaires, titres forts |
| `--c-secondary` | `#134E4A` | titres, texte fort, aplats de marque |
| `--c-accent` | `#14B8A6` | anneau de focus, points d'état, coche succès |
| `--c-bg` | `#FFFFFF` | fond de page (blanc) |
| `--c-surface` | `#FFFFFF` | cartes, barres, champs |
| `--c-surface-alt` | `#F2F1EF` | champs lecture seule, fonds discrets, segmented control |
| `--c-text` | `#1C1B1A` | texte principal |
| `--c-text-muted` | `#6B6862` | sous-titres, aides (AA sur blanc ≈ 5.1:1) |
| `--c-text-faint` | `#9A968E` | légendes, labels consultation, placeholders de valeur |
| `--c-text-empty` | `#B4AFA6` | valeur « Non renseigné » |
| `--c-border` | `#E7E5E1` | contours d'inputs/selects, bordures de boutons |
| `--c-border-card` | `#E9E7E3` | bordures de cartes |
| `--c-separator` | `#F0EEEA` | séparateurs internes (lignes entre champs, lignes notifications) |
| `--c-border-soft` | `#F0EEEA` | séparateurs internes de cartes (obsolète — utiliser `--c-separator`) |
| `--c-primary-tint` | `#E6F2F0` | fond sélection/actif (chips langue, avatar, badge) |
| `--c-danger` | `#B4231F` | erreurs, action destructive (AA sur blanc) |
| `--c-danger-hover` | `#8F1B18` | survol destructif |
| `--c-danger-tint` | `#FBEAE9` | fond d'icône/erreur, hover bouton danger |
| `--c-danger-zone-bg` | `#FDF3F2` | fond carte zone de danger |
| `--c-danger-zone-border` | `#F3D9D7` | bordure carte zone de danger |
| `--c-danger-button-border` | `#E9C9C7` | bordure bouton danger |
| `--c-danger-button-hover-border` | `#DBB4B2` | bordure bouton danger au survol |
| `--c-warning-tint` | `#EEECE8` | badge « Bientôt disponible » (fond) |
| `--c-warning-text` | `#8A8681` | badge « Bientôt disponible » (texte) |
| `--c-toggle-off` | `#D8D5D0` | toggle OFF (piste) |
| `--c-toggle-disabled` | `#EDEBE7` | toggle désactivé (piste) |

Note : le logo Google reste **multicolore officiel** sur fond blanc — ne jamais le teinter.

## Typographie
- Famille unique : **Plus Jakarta Sans** (Google Fonts, poids 400/500/600/700/800).
- Fallback : `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`.
- Pour l'arabe : **Tajawal** (poids 400/500/700) en priorité de pile quand `lang="ar"`.

| Rôle | Desktop | Mobile | Poids | Notes |
|---|---|---|---|---|
| Titre écran (H1) | 28px | 26px | 700 | `letter-spacing:-0.02em; line-height:1.15` |
| Titre section/carte | 17px | 17px | 700 | |
| Titre modale | 19px | 19px | 700 | |
| Sous-titre / corps | 15px | 14.5px | 400 | `line-height:1.5; color:muted` |
| Label de champ | 13.5–14px | idem | 600 | au-dessus du champ, jamais placeholder seul |
| Valeur de champ | 15px | 15px | 600 | |
| Aide / légale | 12.5–13px | idem | 400 | `color:faint/muted` |
| Corps de bouton | 15–16px | idem | 600 | |
| Badge / label majuscule | 11px | 11px | 700 | `letter-spacing:.05em; text-transform:uppercase` |

## Espacement
Échelle base-4 : `4 / 8 / 12 / 16 / 20 / 24 / 28 / 32 / 40 / 48 / 64`.
- Padding carte : **26–28px** desktop · **22px** mobile.
- Gap entre cartes : **22px** desktop · 16px mobile.
- Gap de grille de formulaire : `column 18px / row 20px` (desktop), `row 16px` (mobile).
- Padding contenu : `40px 24px 64px` (profil) / `32px 24px 64px` (édition).

## Rayons
- Carte & zone de danger : **16px**
- Bouton / input / select : **12px**
- Dropdown / menu : 14px
- Petit conteneur (bezel mobile intérieur, boîte recherche) : 10–11px
- Pastille / point / avatar / switch : plein rond (`999px`)
- Badge (pill) : 20px

## Ombres
- Carte : `0 1px 2px rgba(19,78,74,.04), 0 8px 24px rgba(19,78,74,.06)`
- Survol bouton primaire : `0 4px 14px rgba(15,118,110,.25)`
- Survol bouton Google : `0 4px 14px rgba(15,118,110,.14)`
- Dropdown : `0 12px 32px rgba(19,78,74,.14)`
- Modale : `0 20px 50px rgba(19,78,74,.24)`
- Toast : `0 10px 28px rgba(19,78,74,.28)`

## Grille responsive
| Breakpoint | Largeur | Comportement |
|---|---|---|
| **Desktop** ≥ 1024px | contenu centré, max **760px** (profil/édition), carte auth **440px** | grille 2 colonnes possible (Pays+Ville, infos profil) |
| **Tablette** 640–1023px | contenu centré, marges réduites | 1 colonne, mêmes composants |
| **Mobile** < 640px | pleine largeur, marges latérales **18–20px** | 1 colonne, boutons pleine largeur, cibles ≥ 44px |

Hauteur de champ/bouton standard : **50–52px**.

## États interactifs (transverses)
- **hover** : assombrir le fond primaire (`#0F766E`→`#134E4A`) + ombre douce ; sur bordure, passer à `#0F766E`.
- **focus (clavier)** : `box-shadow: 0 0 0 3px rgba(20,184,166,.40)` (anneau accent), `outline:none` **toujours** remplacé. Sur input en focus : bordure `#0F766E` + anneau `rgba(20,184,166,.40)`. Destructif : `rgba(180,35,31,.28/.35)`.
- **active** : léger enfoncement.
- **disabled** : bouton `background:#CFD8D6; color:#8A9997; cursor:not-allowed` (perceptible, jamais invisible). Champ désactivé : `background:#F2F1EF; color:#9A968E`.
- **loading** : spinner anneau accent + label d'action au présent (« Enregistrement… », « Connexion… »), largeur figée (pas de reflow).

## Animations (discrètes uniquement)
- Transitions couleur/ombre : 120–180ms.
- Apparition contenu/dropdown/modale : fade + translate 6–8px, 160–280ms.
- Toast : slide-up + fade 280ms, coche tracée 500ms.
- Spinner : rotation régulière 0.7s linéaire.
- Skeleton : pulsation opacité 1.3s.
- Respecter `prefers-reduced-motion` : neutraliser pulsations/mouvements (états statiques équivalents).

## Accessibilité (AA)
- Contraste texte ≥ 4.5:1 (corps), ≥ 3:1 (grands titres) — palette validée.
- Focus visible partout ; ordre de tabulation logique haut→bas ; `Entrée` valide ; `Échap` ferme modale/dropdown ; piège de focus dans les modales.
- Chaque champ a un `<label for>` visible ; erreurs liées via `aria-describedby` et annoncées ; toasts en `aria-live="polite"`.
- Champs lecture seule exclus de l'ordre de tabulation d'édition.
- `lang` correct ; bascule AR = layout miroir (`dir="rtl"`), focus et alignements inversés.
- Cibles tactiles ≥ 44×44px sur mobile.
