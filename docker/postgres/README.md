# PostgreSQL — Service Docker

## Image

`postgres:17-alpine`

## Container

`chaweer-postgres`

## Variables d'environnement

| Variable | Valeur par défaut | Description |
|---|---|---|
| `POSTGRES_USER` | `postgres` | Utilisateur PostgreSQL |
| `POSTGRES_PASSWORD` | `postgres` | Mot de passe PostgreSQL |
| `POSTGRES_DB` | `chaweer` | Base de données créée automatiquement |

Ces variables peuvent être surchargées via un fichier `.env` à la racine du projet.

## Port

| Hôte | Container |
|---|---|
| `5432` | `5432` |

## Volume

Les données sont persistées dans le volume nommé `postgres-data`.

```
postgres-data:/var/lib/postgresql/data
```

Le volume persiste entre les redémarrages. Pour le supprimer :

```bash
docker compose down -v
```

## Healthcheck

Le container expose un healthcheck via `pg_isready`.

L'API attend que PostgreSQL soit `healthy` avant de démarrer (`depends_on: condition: service_healthy`).

## Connexion locale

```bash
psql postgresql://postgres:postgres@localhost:5432/chaweer
```

## Connexion depuis l'API (dans le réseau Docker)

```
DATABASE_URL=postgresql://postgres:postgres@chaweer-postgres:5432/chaweer
```
