# Chaweer API

Backend REST API pour la plateforme Chaweer.

## Stack

- Node.js 22 LTS
- Express 5
- TypeScript
- Zod
- Pino
- Vitest

## Scripts

| Commande       | Description                  |
| -------------- | ---------------------------- |
| `npm run dev`  | Démarrage en mode développement |
| `npm run build`| Compilation TypeScript       |
| `npm start`    | Démarrage en production      |
| `npm test`     | Exécution des tests          |
| `npm run lint` | Vérification ESLint          |
| `npm run format` | Formatage Prettier         |

## Variables d'environnement

Copier `.env.example` en `.env` :

```bash
cp .env.example .env
```

## Architecture

```
src/
├── app.ts
├── server.ts
├── config/
├── core/
│   ├── errors/
│   ├── middleware/
│   └── logger/
├── shared/
│   ├── types/
│   ├── utils/
│   └── constants/
├── modules/
└── tests/
```
