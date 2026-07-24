FROM node:22-alpine

WORKDIR /app

# Couche 1 : dépendances
COPY package*.json ./
RUN npm ci

# Couche 2 : fichiers Prisma
COPY prisma.config.ts ./
COPY prisma/ ./prisma/

# Couche 3 : génération du Prisma Client
ARG DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
ENV DATABASE_URL=${DATABASE_URL}
RUN npx prisma generate

# Couche 4 : code source + config TypeScript
COPY tsconfig.json ./
COPY src/ ./src/

# Couche 5 : build TypeScript
RUN npm run build

# Couche 6 : migrations au démarrage
ENV PORT=3000
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
