# ================================
# Stage 1: Base
# ================================
FROM node:24-alpine AS base
WORKDIR /app
RUN corepack enable pnpm

# ================================
# Stage 2: Install all dependencies
# ================================
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ================================
# Stage 3: Build
# ================================
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN node_modules/.bin/nest build

# ================================
# Stage 4: Production
# ================================
FROM node:24-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

# Copy all dependencies (includes prisma CLI required for migrate deploy)
COPY --from=deps /app/node_modules ./node_modules

# Copy compiled application
COPY --from=build /app/dist ./dist

# Copy Prisma schema and migrations needed by prisma migrate deploy
COPY database ./database
COPY prisma.config.ts ./

# Copy and prepare the entrypoint script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Run as a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
