FROM node:22-alpine

WORKDIR /app

# Couche 1 : dépendances API
COPY apps/api/package*.json ./
COPY packages/shared/package.json ./packages/shared/
COPY package.json ./package-root.json
RUN npm ci --workspace=apps/api 2>/dev/null || npm ci

# Couche 2 : code du package shared
COPY packages/shared/src/ ./packages/shared/src/
COPY packages/shared/package.json ./packages/shared/package.json

# Couche 3 : fichiers Prisma
COPY apps/api/prisma.config.ts ./
COPY apps/api/prisma/ ./prisma/

# Couche 4 : génération du Prisma Client
ARG DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
ENV DATABASE_URL=${DATABASE_URL}
RUN npx prisma generate

# Couche 5 : code source + config TypeScript
COPY apps/api/tsconfig.json ./
COPY apps/api/src/ ./src/

# Couche 6 : build TypeScript
RUN npm run build

# Couche 7 : migrations au démarrage
ENV PORT=3000
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
