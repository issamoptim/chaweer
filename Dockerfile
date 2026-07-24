FROM node:22-alpine

WORKDIR /app

# Couche 1 : tout le monorepo (package.json + lockfile + workspaces)
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/

# Installer les dépendances du workspace
RUN npm ci

# Couche 2 : code source du package shared + build
COPY packages/shared/src/ ./packages/shared/src/
COPY packages/shared/tsconfig.json ./packages/shared/
WORKDIR /app/packages/shared
RUN npm run build

# Couche 3 : fichiers Prisma de l'API
WORKDIR /app
COPY apps/api/prisma.config.ts ./apps/api/
COPY apps/api/prisma/ ./apps/api/prisma/

# Couche 4 : code source + config TypeScript (copier avant generate)
COPY apps/api/tsconfig.json ./apps/api/
COPY apps/api/src/ ./apps/api/src/

# Couche 5 : génération du Prisma Client (après copie du src)
ARG DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
ENV DATABASE_URL=${DATABASE_URL}
WORKDIR /app/apps/api
RUN npx prisma generate

# Couche 6 : build TypeScript
RUN npm run build

# Couche 7 : migrations au démarrage
ENV PORT=3000
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
