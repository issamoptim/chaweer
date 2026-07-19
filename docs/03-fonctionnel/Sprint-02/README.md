# Sprint-02 — Identity & Profile

> Version : 1.0
> Statut : En cours de conception
> Produit : Chaweer
> Module : Identity & Profile

---

# 1. Contexte

Après la mise en place du système d'authentification (Sprint-01), ce sprint définit l'ensemble du domaine **Identity & Profile**.

L'objectif est de concevoir le modèle métier permettant de gérer les utilisateurs, leurs profils, leurs rôles et leurs parcours d'inscription, indépendamment des choix techniques.

Ce sprint constitue la base de toutes les fonctionnalités nécessitant une identité utilisateur :

- Annuaire des professionnels
- Questions & Réponses
- Consultations
- Rendez-vous
- Avis
- Paiement
- Notifications
- Administration

Toutes les décisions prises dans ce sprint sont considérées comme les fondations de la plateforme.

---

# 2. Objectifs

Les principaux objectifs sont :

- définir le modèle métier Identity & Profile ;
- définir les rôles de la plateforme ;
- définir les règles métier liées aux comptes utilisateurs ;
- définir les parcours d'inscription et de connexion ;
- définir les règles de complétion progressive des profils ;
- préparer les futures implémentations Backend et Frontend.

---

# 3. Périmètre

Le Sprint-02 couvre notamment :

- comptes utilisateurs ;
- authentification (vision fonctionnelle) ;
- profils utilisateurs ;
- profils professionnels ;
- assistants ;
- rôles ;
- permissions ;
- publication des profils professionnels ;
- parcours d'inscription ;
- onboarding progressif.

---

# 4. Hors périmètre

Les sujets suivants ne font pas partie de ce sprint :

- consultations ;
- rendez-vous ;
- paiements ;
- messagerie ;
- notifications ;
- moteur de recherche ;
- facturation ;
- administration avancée ;
- certification des professionnels ;
- gestion des cabinets ;
- support des autres professions juridiques (hors Avocat).

Ces fonctionnalités feront l'objet de sprints dédiés.

---

# 5. Documents du sprint

| Référence | Document | Statut |
|-----------|----------|--------|
| Vision | Vision-Sprint-02.md | ✅ |
| US-009 | Identity & Profile Vision | ✅ |
| US-010 | Identity & Profile Domain | ✅ |
| US-011 | Registration & Progressive Onboarding | ⏳ |
| US-012 | Identity Backend | ⏳ |
| US-013 | Identity Frontend | ⏳ |

---

# 6. Documents de référence

Les documents suivants sont partagés avec les autres sprints du projet :

- Glossaire
- Règles Métier
- Invariants Métier
- Matrice des Permissions
- États Métier
- Domain Events
- Domain Aggregates
- Diagrammes
- Décisions d'Architecture

Ces documents constituent la référence fonctionnelle de la plateforme.

---

# 7. Principes directeurs

Le Sprint-02 repose sur les principes suivants :

- Privacy by Default
- Progressive Profile Completion
- Marketplace First
- Une seule méthode d'authentification par compte
- Identifiant technique unique
- Séparation entre Compte et Profil
- Séparation entre Profil et Profil Professionnel
- Publication automatique des profils professionnels
- Certification indépendante de la publication

---

# 8. Livrables attendus

À la fin du Sprint-02, les éléments suivants devront être validés :

- modèle métier complet ;
- règles métier ;
- parcours utilisateurs ;
- diagrammes fonctionnels ;
- spécifications Backend ;
- spécifications Frontend.

Le développement pourra ensuite débuter sans remettre en cause les décisions métier prises durant ce sprint.

---

# 9. État d'avancement

| Élément | État |
|---------|------|
| Vision | ✅ |
| Domaine métier | ✅ |
| Architecture fonctionnelle | ✅ |
| Parcours utilisateurs | ⏳ |
| Backend | ⏳ |
| Frontend | ⏳ |

---

# 10. Historique

| Version | Date | Auteur | Description |
|---------|------|--------|-------------|
| 1.0 | À compléter | Product Team | Création du Sprint-02 Identity & Profile |