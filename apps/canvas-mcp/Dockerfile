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

COPY --from=builder /app/apps/canvas-mcp/dist ./dist
COPY --from=builder /app/apps/canvas-mcp/node_modules ./node_modules
COPY --from=builder /app/apps/canvas-mcp/package.json ./package.json

EXPOSE 3001

CMD ["node", "dist/http.js"]
