FROM node:22-alpine

WORKDIR /app

# Couche 1 : tout le monorepo (package.json + lockfile + workspaces)
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/

# Installer les dépendances du workspace
RUN npm ci

# Couche 2 : code source du package shared
COPY packages/shared/src/ ./packages/shared/src/

# Couche 3 : fichiers Prisma de l'API
COPY apps/api/prisma.config.ts ./apps/api/
COPY apps/api/prisma/ ./apps/api/prisma/

# Couche 4 : génération du Prisma Client
ARG DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
ENV DATABASE_URL=${DATABASE_URL}
WORKDIR /app/apps/api
RUN npx prisma generate

# Couche 5 : code source + config TypeScript
COPY tsconfig.json ./
COPY src/ ./src/

# Couche 6 : build TypeScript
RUN npm run build

# Couche 7 : migrations au démarrage
ENV PORT=3000
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
