# US-004 — Docker & Docker Compose

## Business Value

Permettre à tout développeur de démarrer Chaweer avec une seule commande.

À la fin de cette User Story, l'ensemble de l'environnement de développement doit pouvoir être lancé avec :

```bash
docker compose up -d
```

Aucune installation locale de PostgreSQL ne doit être nécessaire.

---

# Contexte

Le projet Chaweer est un monorepo composé de plusieurs applications :

- apps/api
- apps/web
- apps/mobile (future)

Le backend utilise Prisma 7 avec PostgreSQL.

Cette User Story prépare uniquement l'environnement Docker de développement.

---

# Objectif

Créer un environnement Docker complet et professionnel.

---

# Technologies

Utiliser exclusivement :

- Docker
- Docker Compose
- PostgreSQL 17
- Node.js 22 LTS

---

# Architecture attendue

Créer uniquement :

docker-compose.yml

.dockerignore

apps/api/Dockerfile

apps/web/Dockerfile

docker/

postgres/

README.md

Ne créer aucun autre dossier.

---

# Containers

Créer uniquement :

chaweer-postgres

chaweer-api

chaweer-web

---

# Réseau

Créer un réseau dédié :

chaweer-network

---

# Volumes

Créer uniquement :

postgres-data

Les données PostgreSQL doivent rester persistantes.

---

# Variables d'environnement

Configurer correctement les variables Docker.

Ne jamais exposer de secrets.

Respecter les fichiers .env existants.

---

# PostgreSQL

Configurer PostgreSQL pour le développement uniquement.

Créer automatiquement :

- utilisateur
- mot de passe
- base de données

à partir des variables d'environnement.

---

# API

Créer un Dockerfile optimisé pour le développement.

Le hot reload doit fonctionner.

---

# Web

Créer un Dockerfile optimisé pour Vite.

Le hot reload doit fonctionner.

---

# Docker Compose

Le docker-compose.yml doit permettre de lancer :

- PostgreSQL
- API
- Web

avec une seule commande.

Les dépendances entre services doivent être correctement définies.

---

# Contraintes

Ne créer :

- aucun reverse proxy
- aucun Nginx
- aucun Traefik
- aucun HTTPS
- aucune configuration de production
- aucun Kubernetes

Cette User Story concerne uniquement le développement local.

---

# Qualité

Utiliser les bonnes pratiques Docker.

Limiter la taille des images.

Utiliser des Dockerfile lisibles.

---

# Vérifications obligatoires

Exécuter :

docker compose config

docker compose up -d

docker compose ps

docker compose down

npm run build

npm run lint

npm test

Corriger toute erreur.

---

# Critères d'acceptation

Le projet démarre avec :

docker compose up -d

Les trois containers sont démarrés.

Prisma peut accéder à PostgreSQL.

Le backend démarre.

Le frontend démarre.

Les volumes persistent.

Le build fonctionne.

Le lint fonctionne.

Les tests passent.

---

# Livrables

Dockerfile API.

Dockerfile Web.

docker-compose.yml.

.dockerignore.

Documentation.

---

# Définition de Terminé

La User Story est terminée lorsque :

- Docker fonctionne entièrement ;
- PostgreSQL est accessible ;
- Prisma peut se connecter ;
- les containers démarrent correctement ;
- build, lint et tests passent ;
- aucune configuration de production n'a été ajoutée.

---

# Statut

À faire