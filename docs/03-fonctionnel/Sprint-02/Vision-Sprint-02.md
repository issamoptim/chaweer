---
title: Vision Sprint-02 — Identity & Profile
version: 1.0
status: Validé
owner: Product Team
module: Identity & Profile
depends_on:
  - Sprint-01 Authentication
next:
  - US-009 Identity & Profile Vision
  - US-010 Identity & Profile Domain
---

# Vision du Sprint-02 — Identity & Profile

## 1. Objectif du sprint

Le Sprint-02 définit le domaine **Identity & Profile** de Chaweer.

Il établit les fondations fonctionnelles permettant de gérer l'identité des utilisateurs, leurs profils, leurs rôles et leurs parcours d'inscription.

Toutes les fonctionnalités futures (consultations, rendez-vous, paiements, avis, messagerie, notifications...) s'appuieront sur ce modèle.

Aucune décision technique (base de données, API, framework...) n'est prise dans ce document.

---

# 2. Vision

Chaweer place l'utilisateur au centre de la plateforme.

L'inscription doit être simple, rapide et demander uniquement les informations strictement nécessaires.

Les informations complémentaires sont collectées progressivement, uniquement lorsqu'elles deviennent utiles à une fonctionnalité.

Cette approche réduit les frictions lors de l'inscription tout en garantissant la qualité des données.

---

# 3. Principes fondateurs

## 3.1 Privacy by Default

Chaweer ne collecte que les informations nécessaires.

Aucune donnée n'est demandée sans justification fonctionnelle.

---

## 3.2 Progressive Profile Completion

Le compte est créé rapidement.

Le profil est enrichi progressivement selon les besoins de l'utilisateur.

---

## 3.3 Marketplace First

L'annuaire constitue le point d'entrée principal de la plateforme.

Un visiteur ou un client peut explorer les professionnels avant même de compléter son profil.

---

## 3.4 Séparation des responsabilités

Le modèle distingue clairement :

- le compte utilisateur ;
- le profil utilisateur ;
- le profil professionnel.

Chaque élément possède son propre cycle de vie.

---

## 3.5 Une identité unique

Chaque compte possède :

- un identifiant technique immuable ;
- une seule méthode d'authentification ;
- un rôle principal.

---

# 4. Méthodes d'inscription

La V1 supporte trois méthodes d'inscription.

- Email + mot de passe
- Téléphone + OTP
- Google

Une fois le compte créé, la méthode d'authentification devient définitive.

Le changement de méthode n'est pas autorisé en V1.

---

# 5. Typologie des utilisateurs

La plateforme distingue les catégories suivantes :

## Visiteur

Utilisateur non authentifié.

Peut uniquement consulter les contenus publics.

---

## Client

Utilisateur authentifié.

Peut utiliser les services proposés par la plateforme après avoir complété les informations requises.

---

## Professionnel

Utilisateur proposant des prestations juridiques.

Dispose d'un espace professionnel dédié.

Son profil devient visible dans l'annuaire uniquement lorsque les informations obligatoires sont complètes.

---

## Assistant

Compte rattaché à un professionnel.

Agit au nom du professionnel selon les permissions accordées.

---

## Administrateur

Compte interne chargé de l'administration de la plateforme.

---

# 6. Publication des profils

Un professionnel peut créer un compte sans apparaître immédiatement dans l'annuaire.

La publication est automatique dès que les informations obligatoires sont complètes.

Aucune validation manuelle n'est prévue en V1.

---

# 7. Certification

La certification est indépendante de la publication.

Elle ne fait pas partie du périmètre de la V1.

Le modèle métier est néanmoins conçu pour l'intégrer ultérieurement.

---

# 8. Complétion progressive

Le profil utilisateur est enrichi progressivement.

Les informations sont demandées uniquement lorsqu'elles deviennent nécessaires.

Exemples :

- poser une question ;
- réserver une consultation ;
- publier un service ;
- recevoir un paiement.

---

# 9. Consultation anonyme

Chaweer permettra à terme d'effectuer des consultations anonymes.

Le professionnel reçoit la demande sans connaître l'identité du client.

Les modalités précises de cette fonctionnalité seront définies dans le sprint consacré aux consultations.

Cette fonctionnalité est hors périmètre de la V1.

---

# 10. Évolution des rôles

Un Client peut devenir Professionnel tant qu'aucune activité métier engageante n'a été réalisée.

Une fois devenu Professionnel, ce changement est irréversible.

Un Professionnel ne peut jamais redevenir Client.

---

# 11. Professions juridiques

Le modèle est conçu pour accueillir plusieurs professions juridiques.

La V1 implémente uniquement le parcours **Avocat**.

Les autres professions seront ajoutées progressivement sans remise en cause du modèle métier.

---

# 12. Principes de qualité

Toutes les décisions prises dans ce sprint doivent respecter les principes suivants :

- simplicité ;
- cohérence métier ;
- évolutivité ;
- séparation des responsabilités ;
- absence de duplication des données ;
- extensibilité sans refonte du modèle.

---

# 13. Hors périmètre

Les sujets suivants seront traités dans des sprints dédiés :

- consultations ;
- rendez-vous ;
- paiements ;
- messagerie ;
- notifications ;
- avis ;
- certification ;
- gestion des cabinets ;
- support des autres professions juridiques ;
- administration avancée.

---

# 14. Critères de réussite

Le Sprint-02 sera considéré comme terminé lorsque :

- le modèle métier sera validé ;
- les rôles seront définis ;
- les parcours utilisateurs seront documentés ;
- les règles métier seront figées ;
- les diagrammes seront validés ;
- les spécifications Backend et Frontend pourront être rédigées sans ambiguïté.

---

# 15. Décisions structurantes

Les décisions suivantes sont considérées comme acquises pour la V1 :

- un compte possède une seule méthode d'authentification ;
- un compte possède un identifiant technique unique ;
- le profil est complété progressivement ;
- la publication est automatique ;
- la certification est indépendante de la publication ;
- le rôle Professionnel est irréversible ;
- le parcours Avocat est le seul implémenté en V1 ;
- les cabinets sont hors périmètre ;
- les avis sont publiés immédiatement par défaut, avec une politique de modération rendue configurable ;
- les comptes supprimés sont conservés de manière logique pendant une durée paramétrable (1 mois par défaut) avant libération éventuelle des identifiants de connexion.

---

# 16. Résultat attendu

À l'issue du Sprint-02, Chaweer disposera d'un modèle d'identité robuste, cohérent et extensible, servant de référence pour tous les développements fonctionnels et techniques des sprints suivants.