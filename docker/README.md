# Docker — Environnement de développement

## Démarrage

```bash
docker compose up -d
```

Cette commande démarre les trois services :

- `chaweer-postgres` — Base de données PostgreSQL 17
- `chaweer-api` — API Backend Node.js 22 (Express + Prisma)
- `chaweer-web` — Frontend React (Vite)

## Prérequis

- Docker Engine avec BuildKit (Docker Desktop ou Engine ≥ 23)
- Docker Compose V2

Aucune installation locale de Node.js ou PostgreSQL n'est requise.

## Commandes utiles

| Commande | Description |
|---|---|
| `docker compose up -d` | Démarrer tous les services |
| `docker compose down` | Arrêter tous les services |
| `docker compose down -v` | Arrêter et supprimer les volumes |
| `docker compose ps` | Vérifier l'état des services |
| `docker compose logs -f` | Suivre les logs |
| `docker compose logs -f chaweer-api` | Logs de l'API uniquement |
| `docker compose build` | Reconstruire les images |
| `docker compose build --no-cache` | Reconstruire sans cache |

## Services

### chaweer-postgres

- Image : `postgres:17-alpine`
- Port : `5432`
- Healthcheck : `pg_isready`
- Volume persistant : `postgres-data`

Voir [postgres/README.md](./postgres/README.md) pour les détails.

### chaweer-api

- Image : `node:22-alpine` (build local)
- Port : `3000`
- Hot reload : `tsx watch` via volume mount
- Dépend de : `chaweer-postgres` (healthcheck)

### chaweer-web

- Image : `node:22-alpine` (build local)
- Port : `5173`
- Hot reload : Vite via volume mount
- Dépend de : `chaweer-api`

## Variables d'environnement

Les valeurs par défaut sont définies dans `docker-compose.yml`.

Pour les surcharger, créer un fichier `.env` à la racine :

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=chaweer
```

## Hot reload

Le hot reload fonctionne via des volumes bind-mount :

- `./apps/api` → modifications TypeScript rechargées automatiquement par `tsx watch`
- `./apps/web` → modifications React rechargées automatiquement par Vite

## Prisma Client

Le Prisma Client est généré au moment du build Docker (`prisma generate`).

Si le schéma Prisma est modifié, régénérer le client sans redémarrer l'image :

```bash
docker compose exec chaweer-api npx prisma generate
```

Pour appliquer les migrations :

```bash
docker compose exec chaweer-api npx prisma migrate dev
```

## Ports utilisés

| Service | Port hôte |
|---|---|
| PostgreSQL | `5432` |
| API | `3000` |
| Web | `5173` |

Vérifier qu'aucun service local n'utilise ces ports avant `docker compose up`.

## Réseau

Tous les services communiquent via le réseau dédié `chaweer-network`.

## Volumes

| Volume | Contenu |
|---|---|
| `postgres-data` | Données PostgreSQL (persistantes) |
| `api_node_modules` | node_modules de l'API (évite le conflit Alpine/macOS) |
| `web_node_modules` | node_modules du Web (évite le conflit Alpine/macOS) |
