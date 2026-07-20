# Prompt correctif Devin — E022 « Modifier mon profil » (visuel uniquement)

> Ne concerne QUE l'apparence : couleurs, emplacements, comportements graphiques. Aucune règle de gestion (obligatoire, validation, permissions) ici.

---

Corrige l'écran `/mon-compte/modifier` pour qu'il corresponde exactement à la maquette de référence. Ne touche qu'au **visuel** (couleurs, disposition, comportements graphiques). N'ajoute aucune règle métier.

## Mise en page
- **Fond de page = blanc `#FFFFFF`** (supprime le gris).
- Contenu **centré**, `max-width:760px`, `margin:0 auto`, padding `32px 24px 64px`. Rien ne doit s'étaler au-delà.
- **Header** en haut : fond blanc, `border-bottom:1px solid #E9E7E3`, padding `15px 40px`, contenu en `space-between`.
  - Gauche : « Chaweer » 19px / 800, couleur `#0F766E`.
  - Droite : « Avocats » et « Mes rendez-vous » (14px / 500, `#6B6862`) + pastille avatar 36px ronde `#0F766E`, initiales « IM » blanches.
- Sous le header, dans le contenu : lien **« ← Retour »** (13.5px / 600, `#0F766E`).
- Titre **« Modifier mon profil »** (28px / 700) + sous-titre « Mettez à jour vos informations personnelles. » (14.5px, `#6B6862`).

## Carte + champs (ordre et emplacement)
Une seule carte blanche (radius 16, bordure `#E9E7E3`, padding 28, ombre `0 1px 2px rgba(19,78,74,.04), 0 8px 24px rgba(19,78,74,.06)`), champs en colonne avec `gap:20px`, dans cet ordre :
1. **Prénom** — champ éditable.
2. **Nom** — champ éditable.
3. **Email** — lecture seule : fond `#F2F1EF`, bordure `#EAE8E3`, texte `#6B6862`, petite icône cadenas dans le label.
4. **Téléphone** — champ éditable (aucun texte d'aide dessous).
5. **Pays** et **Ville** — **côte à côte**, grille 2 colonnes `gap:18px`. Pays affiche « Maroc ». Ville affiche le placeholder « Sélectionner une ville ». Juste sous la grille : texte d'aide « La ville dépend du pays sélectionné. » (12.5px, `#9A968E`).
6. **Nationalité** — menu déroulant (« Marocaine »).

## Style des champs
- Inputs et selects : hauteur 50px, radius 12px, bordure `#E7E5E1`, fond blanc, texte 15px `#1C1B1A`, label 13.5px / 600 `#1C1B1A` au-dessus.
- Focus (tous les champs) : bordure `#0F766E` + `box-shadow:0 0 0 3px rgba(20,184,166,.40)`.
- Selects : chevron personnalisé à droite, `appearance:none`.

## Boutons (emplacement + couleurs)
Barre d'actions **alignée à droite**, `gap:12px`, sous la carte :
- **Annuler** — bouton blanc, bordure `#E7E5E1`, texte `#1C1B1A`, radius 12, hauteur 50, hover fond `#F7F7F5`.
- **« Enregistrer les modifications »** — bouton plein `#0F766E`, texte blanc, radius 12, hauteur 50, hover `#134E4A`.
  - Comportement graphique : **désactivé** (fond `#CFD8D6`, texte `#8A9997`, curseur `not-allowed`) tant qu'aucun champ n'a changé ; passe en vert dès qu'un champ est modifié.
  - Pendant l'enregistrement : spinner + « Enregistrement… », champs grisés (fond `#F2F1EF`).

## Comportements graphiques d'écran
- Après enregistrement : afficher un **écran de confirmation** centré (max 520px) — pastille ronde 72px `#0F766E` avec coche blanche, titre « Profil mis à jour » (22px / 700), texte « Vos informations ont bien été enregistrées. », bouton plein `#0F766E` « Retour à mon profil ».
- Retour/Annuler après une modification : **modale** « Quitter sans enregistrer ? » — overlay `rgba(28,27,26,.42)`, carte blanche radius 16, boutons « Continuer la modification » (plein `#0F766E`) et « Quitter sans enregistrer » (blanc bordé).

## Global
- Police **Plus Jakarta Sans** partout.
- Reprends les tokens exacts du fichier `08-maquettes-profil-description-fidele.md`. Ne dévie pas des couleurs, tailles et emplacements ci-dessus.
