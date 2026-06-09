FROM node:20-alpine AS base
RUN npm install -g pnpm turbo

FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune api --docker

FROM base AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/full/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=installer /app/ .
COPY --from=pruner /app/out/full/ .
RUN turbo run build --filter=api

FROM node:20-alpine AS runner
RUN npm install -g pnpm
WORKDIR /app
ENV NODE_ENV=production

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/full/pnpm-workspace.yaml ./pnpm-workspace.yaml

RUN pnpm install --frozen-lockfile --prod

# Copy built output and prisma
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

WORKDIR /app/apps/api
EXPOSE 3000
CMD ["node", "dist/server.js"]