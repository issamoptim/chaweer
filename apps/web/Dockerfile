FROM node:22-alpine

WORKDIR /app

# Couche 1 : dépendances (cachée si package.json inchangé)
COPY apps/web/package*.json ./
RUN npm ci

EXPOSE 5173

# Les sources sont montées en volume au runtime (hot reload via Vite).
CMD ["npm", "run", "dev"]
