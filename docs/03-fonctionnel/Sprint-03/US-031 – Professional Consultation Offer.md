# US-031 – Professional Consultation Offer

## Informations générales

| Champ | Valeur |
|--------|---------|
| ID | US-031 |
| Epic | EP-01 – Professional Onboarding |
| Titre | Professional Consultation Offer |
| Priorité | High |
| Statut | Planned |
| Sprint | Sprint 03 |
| Acteur principal | Professionnel |

---

# User Story

**En tant que** professionnel,

**Je souhaite** configurer mon offre de consultation,

**Afin que** les utilisateurs connaissent les modalités de consultation avant de prendre rendez-vous.

---

# Objectif

Permettre au professionnel de définir les caractéristiques de son offre de consultation.

Cette offre sera utilisée lors de la réservation.

---

# Contexte

Chaweer propose une offre de consultation simple.

Le professionnel définit une seule offre valable pour l'ensemble de ses domaines d'intervention.

Le tarif ne dépend ni de la spécialité ni du problème juridique.

---

# Fonctionnalités

## Prix de consultation

Le professionnel définit :

- Prix (MAD)

Exemple :

```
350 MAD
```

---

## Durée de consultation

Choix parmi les valeurs proposées.

Exemple :

- 15 min
- 30 min
- 45 min
- 60 min

---

## Modes de consultation

Le professionnel indique les modes qu'il accepte.

- Consultation vidéo
- Consultation au cabinet

*(Le téléphone pourra être ajouté ultérieurement.)*

---

# Règles de gestion

### RG-OFF-001

Une seule offre de consultation est autorisée par professionnel.

---

### RG-OFF-002

Le prix est unique.

Il ne dépend ni de la spécialité ni du domaine d'intervention.

---

### RG-OFF-003

Au moins un mode de consultation doit être sélectionné.

---

### RG-OFF-004

La durée est choisie parmi les valeurs autorisées.

---

# Impact modèle de données

## Entité Professional

Ajout des attributs :

| Attribut | Type |
|----------|------|
| consultationPrice | Decimal |
| consultationDuration | Integer |
| videoEnabled | Boolean |
| officeEnabled | Boolean |

---

# Impact API

GET /api/me/professional/offer

PATCH /api/me/professional/offer

---

# Impact UI

Nouvelle page

```
Mon offre de consultation
```

Sections :

## Tarification

- Prix

---

## Durée

- Liste déroulante

---

## Modes

- Consultation vidéo
- Consultation au cabinet

---

Bouton :

```
Enregistrer
```

---

# Validation

Obligatoire :

- Prix
- Durée
- Au moins un mode

---

# Critères d'acceptation

- Le professionnel peut définir son prix.
- Le professionnel peut choisir la durée.
- Le professionnel peut sélectionner un ou plusieurs modes de consultation.
- Les informations sont enregistrées.
- Les informations seront utilisées lors de la réservation.

---

# Hors périmètre

- Agenda
- Disponibilités
- Publication
- Paiement

---

# Dépendances

Prérequis :

- US-030 – Professional Expertise Configuration

Story suivante :

- US-032 – Professional Availability

---

# Definition of Done

- API disponible.
- Écran disponible.
- Validation des données.
- Persistance.
- Tests unitaires.
- Tests d'intégration.