# Projet

## Nom

Chaweer

---

## Description

Chaweer est une plateforme numérique marocaine mettant en relation des utilisateurs avec des professionnels du droit.

La Version 1 permet uniquement aux avocats de proposer des consultations vidéo.

---

## Vision

Construire la plateforme juridique de référence au Maroc.

---

## Mission

Rendre l'accès aux services juridiques simple, transparent et accessible.

---

## Plateformes

Le projet comporte trois applications :

- API Backend
- Application Web
- Application Mobile

Les applications Web et Mobile consomment exclusivement la même API REST.

---

## MVP

La Version 1 comprend :

- Authentification
- Utilisateurs
- Professionnels
- Domaines d'activité
- Catalogue des prestations
- Offres
- Agenda
- Créneaux
- Réservations
- Paiement
- Consultation vidéo
- Avis

---

## Utilisateurs

### Demandeur

Utilisateur recherchant un professionnel.

### Professionnel

Utilisateur proposant des prestations juridiques.

Dans la Version 1, le professionnel est obligatoirement un avocat.

---

## Architecture

Le backend constitue l'unique source de vérité.

Toute logique métier est implémentée dans l'API.

Le Web et le Mobile ne contiennent aucune logique métier.

---

## Références

Consulter :

- AI-PLAYBOOK.md
- docs/
