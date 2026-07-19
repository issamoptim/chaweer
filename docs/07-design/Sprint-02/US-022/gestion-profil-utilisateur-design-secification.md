# US-022 — UI Design Specification

## Modifier mon profil

## Statut

Ready for Design Implementation

---

# Objectif

Définir le comportement, les interactions et les règles d'interface de la fonctionnalité **Modifier mon profil**.

Cette spécification complète :

- US-022.md (Spécification fonctionnelle)
- Les maquettes haute fidélité validées

---

# Références

## Spécification fonctionnelle

- US-022.md

## Maquettes

Les maquettes validées sont stockées dans :

```text
design/
├── 01-loading.png
├── 02-ready.png
├── 03-editing.png
├── 04-dropdown-open.png
├── 05-saving.png
├── 06-success.png
├── 07-error.png
└── 08-confirm-leave.png
```

Ces maquettes constituent la **référence visuelle officielle** de cette User Story.

Cette spécification décrit :

- les comportements UX ;
- les interactions ;
- les états UI.

Les maquettes définissent :

- le layout ;
- les espacements ;
- les couleurs ;
- la typographie ;
- les composants ;
- les icônes ;
- le responsive.

En cas de divergence, les maquettes validées font foi pour tous les aspects visuels.

---

# Inventaire des écrans

Cette User Story comprend les écrans suivants :

| Écran | Maquette |
|--------|----------|
| Loading | design/01-loading.png |
| Ready | design/02-ready.png |
| Editing | design/03-editing.png |
| Dropdown ouvert | design/04-dropdown-open.png |
| Saving | design/05-saving.png |
| Success | design/06-success.png |
| Error | design/07-error.png |
| Confirmation avant fermeture | design/08-confirm-leave.png |

---

# Layout

## Header

Voir :

```
design/02-ready.png
```

Le Header est identique à celui de US-021.

Il contient :

- Bouton Retour
- Logo Chaweer
- Avatar utilisateur

---

## Body

Voir :

```
design/02-ready.png
```

Le contenu est centré.

Le formulaire est présenté dans une Card.

Le layout reste identique sur tous les états.

---

## Footer

Voir :

```
design/02-ready.png
```

Deux actions sont disponibles :

- Annuler
- Enregistrer les modifications

Les boutons sont alignés à droite, **sous la carte**, avec un `gap` de 12px.

- **Annuler** : fond `#FFFFFF`, texte `#1C1B1A`, bordure 1.5px `#E7E5E1`, hover fond `#F7F7F5`, hauteur 50, radius 12.
- **Enregistrer les modifications** : 2 états :
  - **État 1 (désactivé/grisé)** : fond `#CFD8D6`, texte `#8A9997`, `cursor:not-allowed` — quand aucune modification n'a été faite.
  - **État 2 (actif/vert)** : fond `#0F766E`, texte `#FFFFFF`, `cursor:pointer`, hover `#134E4A`, focus `0 0 0 3px rgba(20,184,166,.40)` — dès la 1ʳᵉ modification.
  - Bascule : état 1 par défaut → état 2 à la 1ʳᵉ modif → revient en état 1 si tout est annulé.
  - Pendant l'enregistrement : spinner + « Enregistrement… », champs désactivés.
  - Commun : hauteur 50, radius 12, Plus Jakarta Sans 15/600.

---

# Formulaire

Voir :

```
design/02-ready.png
```

## Champs éditables

- Prénom
- Nom
- Téléphone
- Pays
- Ville
- Nationalité

## Champs lecture seule

- Email

Les champs lecture seule utilisent le style Disabled défini par le Design System.

---

# États UI

## Loading

Maquette :

```
design/01-loading.png
```

Comportement :

- Skeleton Loader affiché.
- Structure complète visible.
- Aucune interaction possible.

---

## Ready

Maquette :

```
design/02-ready.png
```

Comportement :

- Données préremplies.
- Bouton Enregistrer désactivé.
- Aucun message affiché.

---

## Editing

Maquette :

```
design/03-editing.png
```

Comportement :

- Les champs deviennent modifiables.
- Le bouton Enregistrer est activé dès la première modification.
- Les valeurs saisies sont conservées.

---

## Dropdown ouvert

Maquette :

```
design/04-dropdown-open.png
```

Comportement :

- Recherche disponible.
- Navigation clavier.
- Élément sélectionné mis en évidence.
- Fermeture après sélection.

---

## Saving

Maquette :

```
design/05-saving.png
```

Comportement :

- Tous les champs sont désactivés.
- Spinner dans le bouton Enregistrer.
- Double soumission impossible.

---

## Success

Maquette :

```
design/06-success.png
```

Comportement :

- **Écran de confirmation dédié** : pastille succès 72px + coche animée, titre « Profil mis à jour », texte « Vos informations ont bien été enregistrées. »
- Bouton « Retour à mon profil » → redirection vers Mon Compte.
- Les nouvelles informations sont affichées.

---

## Error

Maquette :

```
design/07-error.png
```

Comportement :

- Toast d'erreur.
- Les données saisies sont conservées.
- Les erreurs de validation sont affichées sous les champs concernés.
- Le focus est positionné sur le premier champ invalide.

---

## Confirmation avant fermeture

Maquette :

```
design/08-confirm-leave.png
```

Comportement :

Lorsqu'une modification non enregistrée existe, une boîte de dialogue est affichée.

Titre : « Quitter sans enregistrer ? »

Actions disponibles :

- Continuer la modification (par défaut)
- Quitter sans enregistrer

---

# Responsive

Les maquettes sont disponibles pour :

- Desktop
- Tablet
- Mobile

Les comportements restent identiques.

Seule la disposition des composants évolue.

---

# Design System

La page utilise exclusivement les composants du Design System.

Composants utilisés :

- Page Header
- Card
- Text Input
- Select
- Button
- Toast
- Modal
- Skeleton Loader
- Spinner

Aucun composant spécifique à cette User Story ne doit être créé.

---

# Accessibilité

La page respecte les règles suivantes :

- navigation clavier complète ;
- focus visible ;
- labels associés aux champs ;
- annonces des toasts pour les lecteurs d'écran ;
- contraste conforme WCAG AA.

---

# Animations

Animations autorisées :

- apparition des Toasts ;
- ouverture des listes déroulantes ;
- Spinner de sauvegarde ;
- ouverture de la boîte de dialogue.

Les animations restent discrètes et rapides.

---

# Source de vérité

La source de vérité est composée de :

1. US-022.md pour les règles fonctionnelles.
2. Les maquettes présentes dans le dossier `design/` pour tous les aspects visuels.
3. Cette spécification pour les comportements UX/UI.

En cas de divergence :

- la User Story prévaut pour le fonctionnel ;
- les maquettes prévalent pour le visuel ;
- cette spécification prévaut pour les interactions utilisateur.