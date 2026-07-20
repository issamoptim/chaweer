# US-028 – Professional Account Registration (Avocat)

## Informations générales

| Champ | Valeur |
|--------|---------|
| ID | US-028 |
| Epic | EP-01 – Professional Onboarding |
| Titre | Professional Account Registration (Avocat) |
| Priorité | High |
| Statut | Planned |
| Sprint | Sprint 03 |
| Acteur principal | Visiteur |

---

# User Story

**En tant que** visiteur souhaitant proposer des consultations juridiques,

**Je souhaite** créer directement un compte professionnel Chaweer,

**Afin de** démarrer mon activité sur la plateforme et poursuivre la configuration de mon espace professionnel.

---

# Objectif

Permettre à un visiteur de créer un compte professionnel sans devoir créer au préalable un compte utilisateur classique.

La création du compte constitue le point d'entrée du parcours d'onboarding professionnel.

À ce stade, aucun profil public n'est encore disponible.

---

# Contexte

Chaweer permet à un avocat de rejoindre directement la plateforme via un parcours dédié.

En Version 1, la plateforme est exclusivement réservée aux avocats.

Lors de cette étape, seules les informations nécessaires à la création du compte sont demandées.

La configuration du profil professionnel, des prestations, des tarifs et des disponibilités est réalisée dans les User Stories suivantes.

---

# Parcours utilisateur

## Scénario principal

Le visiteur :

1. sélectionne **"Vous êtes avocat ? Créer un compte professionnel"** ;
2. choisit son mode d'inscription ;
3. crée son compte ;
4. est automatiquement authentifié ;
5. est redirigé vers le parcours de configuration de son profil professionnel.

---

# Modes d'inscription

Le visiteur peut choisir l'une des méthodes suivantes :

- Continuer avec Google
- Continuer avec une adresse e-mail
- Continuer avec un numéro de téléphone

Les trois méthodes offrent le même résultat métier.

---

# Données collectées

Selon le mode choisi :

### Email

- Adresse e-mail
- Mot de passe

### Google

- Compte Google

### Téléphone

- Numéro de téléphone
- Code OTP

Aucune autre information personnelle n'est demandée à cette étape.

---

# Résultat attendu

À l'issue de cette User Story :

- un compte Chaweer est créé ;
- un profil professionnel est créé avec le statut **Brouillon** ;
- l'utilisateur est connecté ;
- le parcours d'onboarding professionnel peut commencer.

Le professionnel n'est pas encore visible sur la plateforme.

---

# Hors périmètre

Cette User Story ne couvre pas :

- les informations personnelles du profil ;
- la photo ;
- le barreau ;
- la ville ;
- les langues ;
- les spécialités ;
- les prestations ;
- les tarifs ;
- les disponibilités ;
- la publication du profil.

Ces éléments sont traités dans les User Stories suivantes.

---

# Règles de gestion

### RG-PRO-001

Un visiteur peut créer directement un compte professionnel.

---

### RG-PRO-002

La création d'un compte professionnel entraîne automatiquement la création d'un compte Chaweer associé.

---

### RG-PRO-003

Le profil professionnel est créé avec le statut **Brouillon**.

---

### RG-PRO-004

Un profil professionnel en statut **Brouillon** n'est jamais visible publiquement.

---

### RG-PRO-005

Le professionnel doit poursuivre le parcours d'onboarding afin de compléter son profil avant de pouvoir le publier.

---

# Critères d'acceptation

## AC-1

**Étant donné** un visiteur

**Quand** il choisit "Créer un compte professionnel"

**Alors** il accède au parcours d'inscription professionnelle.

---

## AC-2

**Étant donné** un visiteur

**Quand** il termine l'inscription

**Alors** un compte Chaweer est créé.

---

## AC-3

**Étant donné** un nouveau professionnel

**Quand** son compte est créé

**Alors** un profil professionnel est automatiquement créé avec le statut **Brouillon**.

---

## AC-4

**Étant donné** un nouveau professionnel

**Quand** son inscription est terminée

**Alors** il est automatiquement connecté.

---

## AC-5

**Étant donné** un profil professionnel en statut **Brouillon**

**Alors** il n'est pas visible dans la plateforme.

---

## Dépendances

### Prérequis

- Sprint 02 – Authentification
- Sprint 02 – Gestion des comptes

### User Stories suivantes

- US-031 – Professional Profile Setup
- US-032 – Professional Services & Pricing
- US-033 – Availability & Schedule Setup
- US-034 – Professional Profile Publication

---

# Définition of Done

- Création du compte professionnel.
- Authentification automatique.
- Création du profil professionnel en brouillon.
- Redirection vers l'onboarding.
- Tests unitaires et d'intégration validés.
- Documentation mise à jour.