FROM node:20-alpine AS base
WORKDIR /app

RUN npm install -g pnpm@10.12.4

FROM base AS deps
COPY package.json ./
RUN pnpm install --no-frozen-lockfile

FROM deps AS builder
COPY . .
RUN pnpm run build

FROM node:20-alpine AS runner
WORKDIR /app

# Install supervisor and poke
RUN apk add --no-cache supervisor
RUN npm install -g poke

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY credentials.json /root/.config/poke/credentials.json

EXPOSE 3847

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
