FROM node:22-alpine

WORKDIR /app

# Couche 1 : dépendances (cachée si package.json inchangé)
COPY apps/api/package*.json ./
RUN npm ci

# Couche 2 : fichiers Prisma
COPY apps/api/prisma.config.ts ./
COPY apps/api/prisma/ ./prisma/

# Couche 3 : génération du Prisma Client au build time
# Prisma ne se connecte pas à la base lors de `generate`.
# L'URL placeholder est suffisante pour satisfaire prisma.config.ts.
# Le client généré est stocké dans node_modules et persist via le volume api_node_modules.
ARG DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
ENV DATABASE_URL=${DATABASE_URL}
RUN npx prisma generate

# Couche 4 : configuration TypeScript
COPY apps/api/tsconfig.json ./

EXPOSE 3000

# Le répertoire src/ est monté en volume au runtime (hot reload via tsx watch).
CMD ["npm", "run", "dev"]
