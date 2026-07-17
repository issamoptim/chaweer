# ADR-003 — Stratégie d'authentification des utilisateurs

> Version : 1.0

> Statut : À valider

> Date : 13 juillet 2026

> Auteur : Issam Majdoubi

> Relecture : associés

---

## Contexte

L'authentification constitue le premier point de contact entre un utilisateur et Chaweer.

Le choix du mode d'inscription influence directement le taux de conversion, l'expérience utilisateur, la sécurité des comptes, le coût d'exploitation de la plateforme ainsi que les possibilités d'évolution futures.

Chaweer est conçu en priorité pour les citoyens marocains. Les choix fonctionnels doivent donc s'adapter aux usages numériques locaux plutôt que reproduire les standards de plateformes étrangères.

---

## Problème

Quelle stratégie d'authentification doit être adoptée par Chaweer ?

L'objectif est de proposer un parcours d'inscription simple, rapide et accessible au plus grand nombre, tout en garantissant un niveau de sécurité adapté et en préparant les évolutions futures de la plateforme.

---

## Analyse des usages

Le public cible de Chaweer utilise majoritairement :

- un smartphone Android ;
- un numéro de téléphone personnel connu et utilisé quotidiennement ;
- WhatsApp comme principal moyen de communication.

À l'inverse :

- l'email est souvent peu consulté par une partie des utilisateurs ;
- les mots de passe constituent une source fréquente d'oubli et de blocage ;
- de nombreux utilisateurs possèdent un compte Google sans réellement connaître son fonctionnement.

Cette réalité oriente naturellement la conception du parcours d'inscription.

---

## Options étudiées

## Option 1 — Email + mot de passe

### Avantages

- Standard largement répandu.
- Aucun coût lié à l'envoi de SMS.
- Mise en œuvre simple.
- Déjà implémenté dans le POC.

### Inconvénients

- Oubli fréquent des mots de passe.
- L'email n'est pas le moyen d'identification naturel d'une grande partie des utilisateurs marocains.
- Parcours d'inscription plus long.

---

## Option 2 — Google uniquement

### Avantages

- Inscription rapide.
- Aucun mot de passe à gérer.
- Très pratique pour les utilisateurs Android.

### Inconvénients

- Tous les utilisateurs ne souhaitent pas utiliser Google.
- Certains ignorent qu'ils possèdent déjà un compte Google.
- Dépendance à un fournisseur externe.

---

## Option 3 — Téléphone + OTP

Le numéro de téléphone devient l'identifiant principal de l'utilisateur.

L'inscription s'effectue selon le parcours suivant :

1. saisie du numéro de téléphone ;
2. réception d'un code OTP ;
3. validation du code ;
4. création du profil.

### Avantages

- Très faible friction.
- Aucun mot de passe à mémoriser.
- Adapté aux habitudes numériques marocaines.
- Permet l'envoi futur de rappels de rendez-vous et de notifications.

### Inconvénients

- Coût lié à l'envoi des SMS.
- Dépendance à un fournisseur OTP.

---

## Décision retenue

Il est proposé d'adopter une authentification principalement basée sur le numéro de téléphone.

Les méthodes d'authentification seraient organisées comme suit.

## Méthode principale

- Numéro de téléphone + code OTP.

## Méthodes secondaires

- Connexion avec Google.
- Email + mot de passe.

Le numéro de téléphone deviendrait l'identifiant principal de l'utilisateur.

L'adresse email resterait facultative lors de l'inscription mais pourrait être ajoutée ultérieurement afin de compléter le profil et faciliter certaines communications.

Chaque numéro de téléphone serait unique et ne pourrait être associé qu'à un seul compte utilisateur.

> **Cette proposition reste à valider avant d'être adoptée comme règle d'architecture du projet.**

---

## Motivation

Cette proposition répond aux objectifs suivants :

- réduire la friction lors de l'inscription ;
- adapter Chaweer aux usages numériques des citoyens marocains ;
- limiter les problèmes liés aux mots de passe oubliés ;
- simplifier l'accès aux fonctionnalités de la plateforme ;
- préparer les futures fonctionnalités basées sur le téléphone (notifications, rappels de rendez-vous, récupération de compte, authentification renforcée).

---

## Conséquences

## Pour les utilisateurs

- inscription plus rapide ;
- moins de difficultés liées aux mots de passe ;
- expérience davantage adaptée aux usages mobiles.

## Pour Chaweer

- coût lié aux SMS OTP ;
- amélioration du taux de conversion des visiteurs en utilisateurs ;
- identifiant unique basé sur le numéro de téléphone.

## Pour les évolutions futures

Le numéro de téléphone pourra être utilisé pour :

- les rappels de rendez-vous ;
- les notifications importantes ;
- la récupération du compte ;
- l'authentification renforcée.

---

## Implémentation progressive

Si cette proposition est validée, sa mise en œuvre sera réalisée progressivement.

## Phase 1 — POC (Proof of Concept)

Objectif : valider le concept de Chaweer et les principaux parcours utilisateurs.

Méthodes disponibles :

- Email + mot de passe (méthode principale)
- Google (optionnel selon les priorités de développement)

Le numéro de téléphone pourra être enregistré dans le profil utilisateur mais ne sera pas utilisé comme identifiant principal.

## Phase 2 — Première version de production (V1)

Objectif : proposer une expérience d'inscription adaptée aux usages des utilisateurs marocains.

Méthodes disponibles :

- Numéro de téléphone + OTP (méthode principale)
- Google (méthode secondaire)
- Email + mot de passe (méthode alternative)

À partir de cette version, le numéro de téléphone deviendra l'identifiant principal de l'utilisateur.

---

## Alternatives futures

Les évolutions suivantes sont envisagées :

- authentification via WhatsApp OTP ;
- Apple Sign-In ;
- Facebook Login (si la demande le justifie) ;
- authentification multifacteur pour les professionnels.

Ces évolutions ne remettront pas en cause le principe d'une authentification centrée sur le numéro de téléphone.

---

## Documents impactés

Cette proposition impacte notamment :

- `../../02-metier/06-Modele-Metier.md`
- `../../03-fonctionnel/` _(document à créer)_
- les futures spécifications d'inscription et de connexion ;
- les API d'authentification ;
- le système de notifications.

---

## Validation

## Décision

⏳ **À valider**

Cette proposition sera réévaluée avant le développement de la première version de production (V1), en tenant compte :

- des retours sur le POC ;
- des contraintes techniques ;
- du coût des fournisseurs OTP ;
- de la stratégie produit retenue.

Une fois validée, cette ADR deviendra la référence officielle concernant la stratégie d'authentification de Chaweer.