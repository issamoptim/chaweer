# 02 — Composants réutilisables (web)

Réutiliser ces composants partout. Ne pas créer d'équivalent s'il existe déjà.

## Button
Props : `variant` (primary | secondary | ghost | danger-soft | link), `size` (défaut h=50–52px), `loading`, `disabled`, `fullWidth`, `iconLeft`.
- **primary** : fond `#0F766E`, texte blanc, radius 12px. hover `#134E4A` + ombre. disabled `#CFD8D6`/`#8A9997`.
- **secondary** : fond blanc, bordure 1.5px `#E7E5E1` (ou `#0F766E` pour variante teintée), texte `#1C1B1A`/`#0F766E`. hover fond `#F7F7F5` ou `#E6F2F0`.
- **ghost** : sans fond, texte `#0F766E`, icône flèche possible (Retour). hover souligné.
- **danger-soft** : fond transparent, texte `#B4231F`, bordure `#EBD3D2`. hover fond `#FBEAE9`. (action « Supprimer mon compte » — discrète, jamais un gros bouton rouge plein).
- **danger** (plein) : fond `#B4231F`, texte blanc — réservé à la confirmation destructive dans la modale.
- **loading** : remplace le label par spinner + label présent, largeur figée.

## GoogleButton (auth)
Bouton blanc, bordure 1.5px `#E7E5E1`, h=52px, logo Google officiel 4 couleurs à gauche, label « Continuer avec Google » centré. hover bordure `#0F766E` + ombre + translate -1px. **Toujours dominant** (premier, pleine largeur) sur les écrans d'auth. État loading : spinner + « Connexion… ».

## TextInput
Label au-dessus (600), champ h=50–52px, bordure 1.5px `#E7E5E1`, radius 12px, padding 0 15–16px.
- focus : bordure `#0F766E` + anneau `rgba(20,184,166,.35)`.
- error : bordure `#B4231F` + anneau rouge léger + message sous le champ (icône + texte 13px `#B4231F`).
- disabled : fond `#F2F1EF`, texte `#9A968E`.
- Champ mot de passe : bouton œil afficher/masquer (cible ≥44px), pas de champ « confirmer ».

## Select (liste déroulante)
Même gabarit qu'un input. Chevron à droite (rotation 180° à l'ouverture).
- **Recherche intégrée** en haut du menu (loupe + input), **saisie libre interdite** (on ne choisit qu'une option).
- Menu : fond blanc, bordure `#E7E5E1`, radius 14px, ombre dropdown, apparition fade 160ms.
- Option sélectionnée : fond `#E6F2F0`, texte `#0F766E` 600, coche à droite.
- Clavier : flèches naviguer, Entrée choisir, Échap fermer.
- **Dépendance** : le Select Ville dépend du Pays ; changer le Pays réinitialise la Ville.

## ReadOnlyField
Libellé muted + icône cadenas ; valeur dans un bloc `background:#F2F1EF`, bordure `#EAE8E3`, radius 12px, texte `#6B6862` 500. Texte d'aide optionnel dessous (12.5px faint). Exclu de la tabulation d'édition. (Ex. Téléphone, Email.)

## Switch (toggle)
Piste 46×28px radius plein ; bouton (knob) 22px blanc, ombre douce, transition `left .18s`.
- on : piste `#0F766E`. off : `#D8D5D0`. disabled : piste `#EDEBE7`, knob opacité .7, `cursor:not-allowed`.
- Usage notifications : Email, Push (actifs), SMS (disabled + badge « Bientôt disponible »).

## Card
Fond blanc, bordure 1px `#E7E5E1`, radius 20px, padding 40/28/22px selon breakpoint, ombre carte. En-tête : titre 17px 700 + sous-titre 13px faint ; badge optionnel à droite (ex. « Lecture seule »).

## Badge / Pill
Pill radius 20px, 11px 600–700.
- neutre : `#F2F1EF` / bordure `#E7E5E1` / texte `#6B6862`.
- info primaire : `#E6F2F0` / texte `#0F766E`.
- « Bientôt disponible » : fond `#FBF3E1`, bordure `#F0E4C4`, texte `#8A7A52`, uppercase.
- vérifié (contexte marketing) : teintes vertes.

## PageHeader
Bouton Retour (ghost, flèche gauche) + H1 + sous-titre. Sur mobile, flèche retour dans l'app-bar.

## Toast
Ancré bas-centre, radius 12px, padding 12×18px, ombre toast, slide-up 280ms, auto-disparition ~2.5s, `aria-live="polite"`.
- succès : fond `#134E4A`, pastille accent + coche tracée, ex. « Profil mis à jour avec succès. »
- erreur : fond `#B4231F`, icône alerte, ex. « Impossible de mettre à jour votre profil. »

## Modal
Overlay `rgba(28,27,26,.42)`, boîte blanche max 400px, radius 20px, padding 28px, ombre modale, fade-in. Piège de focus, `Échap` = fermer/annuler. Action par défaut mise en avant (primaire).
- Usage : confirmation suppression de compte ; confirmation « Quitter cette page ? ».

## Spinner
Anneau 17–44px, bordure `#E7E5E1` + `border-top:#14B8A6`, rotation 0.7s. Dans les boutons (loading) et écrans de transition.

## Skeleton
Barres gris `#E7E5E1`, radius 5–12px, pulsation 1.3s. Reproduit la structure cible (pas de saut de layout). Champs désactivés pendant le chargement.

## AppBar (connecté)
Barre blanche, bordure basse `#E1E0DC`. Gauche : logo « Chaweer » (+ flèche retour sur mobile). Droite : liens de nav (desktop) + avatar rond initiales `#0F766E`/blanc 34px.

## ProFooter (auth, secondaire)
Ligne discrète hors carte : « Vous êtes avocat ? → Accéder à l'espace avocat » (texte muted + lien `#0F766E` + flèche). Jamais un bouton plein, jamais au-dessus de la ligne de flottaison.
