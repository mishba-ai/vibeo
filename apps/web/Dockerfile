FROM node:20-alpine AS base
RUN pnpm install -g turbo

FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune web --docker

FROM base AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json
RUN pnpm install

FROM base AS builder
WORKDIR /app
COPY --from=installer /app/node_modules ./node_modules
COPY --from=pruner /app/out/full/ .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN turbo run build --filter=web

FROM nginx:alpine AS runner
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

RUN echo 'server {\
  listen 80;\
  location / { \
  root /usr/share/nginx/html; \
  try_files $uri $uri/ /index.html'\
  }\
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx","-g","daemon off;"]