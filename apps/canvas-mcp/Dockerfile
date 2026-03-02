FROM node:20-alpine AS base
WORKDIR /app

RUN npm install -g pnpm@10.12.4

# Copy monorepo root manifests and lockfile
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
COPY apps/canvas-mcp/package.json ./apps/canvas-mcp/package.json
RUN pnpm install --frozen-lockfile --filter canvas-mcp-server

FROM deps AS builder
COPY apps/canvas-mcp ./apps/canvas-mcp
WORKDIR /app/apps/canvas-mcp
RUN pnpm run build

FROM node:20-alpine AS runner
WORKDIR /app

# Install supervisor and poke
RUN apk add --no-cache supervisor
RUN npm install -g poke

COPY --from=builder /app/apps/canvas-mcp/dist ./dist
COPY --from=builder /app/apps/canvas-mcp/node_modules ./node_modules
COPY --from=builder /app/apps/canvas-mcp/package.json ./package.json
COPY apps/canvas-mcp/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 3001

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
