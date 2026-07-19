---
title: US-009 — Identity & Profile Vision
id: US-009
epic: EP-Identity
priority: Critical
status: Validé
owner: Product Team
module: Identity & Profile
depends_on:
  - Vision-Sprint-02
next:
  - US-010 Identity & Profile Domain
---

# US-009 — Identity & Profile Vision

## 1. Contexte

Chaweer est une marketplace de services juridiques mettant en relation des clients et des professionnels du droit.

Avant de proposer des fonctionnalités telles que les consultations, les rendez-vous, les avis, les paiements ou la collaboration entre professionnels, la plateforme doit disposer d'un domaine **Identity & Profile** robuste permettant de gérer l'identité numérique, les profils, les rôles et les modes d'identification des utilisateurs.

Cette User Story définit la vision fonctionnelle du domaine **Identity & Profile**.

Elle décrit les objectifs métier et les principes fonctionnels qui guideront la conception du domaine.

---

# 2. Problématique

Les plateformes de services souffrent souvent des problèmes suivants :

- processus d'inscription trop longs ;
- abandon lors de la création du compte ;
- collecte de données inutiles ;
- confusion entre compte utilisateur et profil public ;
- difficulté à faire évoluer un utilisateur vers un professionnel ;
- dépendance à un unique mode d'authentification ;
- manque de séparation entre identité, profil et activité métier.

Chaweer souhaite éliminer ces limitations dès la conception du produit.

---

# 3. Vision Produit

Créer un domaine d'identité moderne, évolutif et centré sur l'utilisateur.

L'inscription doit être simple.

Le choix du mode d'identification doit rester libre.

Les informations personnelles sont collectées progressivement.

Les profils professionnels deviennent visibles uniquement lorsqu'ils satisfont les critères de publication.

Le modèle doit pouvoir évoluer sans remise en cause de son architecture.

---

# 4. Objectifs métier

Le domaine Identity & Profile doit permettre de :

- créer un compte utilisateur ;
- authentifier un utilisateur ;
- associer un compte à un ou plusieurs Identity Providers ;
- gérer les profils personnels ;
- gérer les profils professionnels ;
- gérer les rôles des utilisateurs ;
- permettre l'évolution d'un Client vers un Professionnel ;
- publier automatiquement les profils professionnels ;
- préparer l'intégration de futurs Identity Providers ;
- constituer la fondation des autres domaines de la plateforme.

---

# 5. Valeur métier

La mise en place de ce domaine apporte plusieurs bénéfices.

## Pour les utilisateurs

- inscription rapide ;
- liberté du mode d'identification ;
- meilleure expérience utilisateur ;
- moins d'informations demandées au départ ;
- parcours de création de compte simplifié.

---

## Pour les professionnels

- création progressive du profil professionnel ;
- publication automatique ;
- meilleure visibilité ;
- évolution naturelle du profil.

---

## Pour Chaweer

- architecture durable ;
- Domain Model extensible ;
- réduction des coûts de maintenance ;
- intégration facilitée de nouveaux Identity Providers ;
- préparation de l'ouverture à d'autres professions juridiques.

---

# 6. Personas concernés

## Visiteur

Découvre la plateforme sans créer de compte.

---

## Client

Utilise les services proposés par la plateforme.

---

## Professionnel

Propose des prestations juridiques.

---

## Assistant

Agit au nom d'un professionnel selon les permissions qui lui sont déléguées.

Ce persona fait partie de l'architecture cible de Chaweer.

Les mécanismes de délégation seront définis dans des User Stories dédiées.

---

## Administrateur

Administre la plateforme.

---

# 7. Principes fonctionnels

Le domaine repose sur les principes suivants :

- une identité unique par compte ;
- un compte peut être associé à un ou plusieurs Identity Providers ;
- séparation entre Account et Profile ;
- séparation entre Profile et ProfessionalProfile ;
- Zero Friction Onboarding ;
- Progressive Onboarding ;
- Privacy by Default ;
- publication automatique des profils professionnels ;
- certification indépendante de la publication ;
- Marketplace First.

En V1, Chaweer supporte les Identity Providers suivants :

- Email
- Phone Number
- Google

Le Domain Model est conçu pour intégrer ultérieurement d'autres Identity Providers (Apple, Microsoft, FranceConnect, etc.) sans remise en cause de son architecture.

---

# 8. Fonctionnalités couvertes

Cette User Story couvre les capacités suivantes :

- création d'un compte ;
- authentification ;
- gestion des Identity Providers ;
- gestion des rôles ;
- gestion des profils utilisateurs ;
- gestion des profils professionnels ;
- gestion des assistants ;
- évolution Client → Professionnel ;
- publication automatique des profils professionnels ;
- suppression logique d'un compte.

---

# 9. Hors périmètre

Les fonctionnalités suivantes ne sont pas couvertes :

- consultations ;
- rendez-vous ;
- paiements ;
- messagerie ;
- notifications ;
- avis ;
- administration avancée ;
- certification des professionnels ;
- gestion des cabinets ;
- gestion documentaire ;
- autres professions juridiques.

---

# 10. Dépendances

Cette User Story constitue la fondation des domaines suivants :

- Consultations
- Rendez-vous
- Paiements
- Avis
- Notifications
- Administration
- Agenda
- Messagerie
- Recherche
- IAM & Permissions

---

# 11. Indicateurs de réussite

Le domaine sera considéré comme réussi lorsque :

- un utilisateur peut créer un compte en quelques étapes ;
- un utilisateur peut choisir son Identity Provider ;
- les informations sont demandées progressivement ;
- les rôles sont clairement définis ;
- les profils professionnels sont publiés automatiquement lorsque les critères sont satisfaits ;
- les règles métier permettent une implémentation sans ambiguïté.

---

# 12. User Story

**En tant que** visiteur,

**Je souhaite** créer un compte avec le mode d'identification de mon choix (Email, Phone Number ou Google), puis compléter progressivement mon profil,

**Afin de** commencer rapidement à utiliser les services de Chaweer sans être bloqué par un processus d'inscription complexe.

---

# 13. Critères d'acceptation

Le domaine devra respecter les critères suivants :

- un Account possède un identifiant technique unique ;
- un Account possède exactement un Profile ;
- un compte peut être associé à un ou plusieurs Identity Providers ;
- en V1, les Identity Providers supportés sont : Email, Phone Number et Google ;
- un Identity Provider ne peut être associé qu'à un seul Account ;
- un utilisateur peut être Client ou Professionnel ;
- un Client peut devenir Professionnel ;
- un ProfessionalProfile est indépendant du Profile ;
- un professionnel n'apparaît dans l'annuaire qu'après publication ;
- les informations sont demandées uniquement lorsqu'elles deviennent nécessaires ;
- la suppression d'un compte est réalisée sous forme de Soft Delete avec une durée de rétention configurable ;
- la certification reste indépendante de la publication.

---

# 14. Risques couverts

Cette User Story permet de limiter les risques suivants :

- duplication des comptes ;
- multiplication des identités ;
- architecture difficile à faire évoluer ;
- dépendance à un unique Identity Provider ;
- confusion entre identité et activité métier ;
- formulaires d'inscription trop complexes ;
- incohérence des règles métier entre les différents domaines.

---

# 15. Résultat attendu

À l'issue de cette User Story, la vision fonctionnelle du domaine **Identity & Profile** est définie.

Les concepts métier, les objectifs, les principes fonctionnels et les responsabilités du domaine sont validés.

Cette User Story constitue la référence fonctionnelle pour la conception du domaine (US-010), du Domain Model (US-012) et de l'ensemble des User Stories techniques du Sprint 02.