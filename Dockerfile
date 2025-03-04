## Builder stage
FROM oven/bun:1.2.4 AS builder
WORKDIR /app

COPY package.json bun.lock vite.config.ts tsconfig.json index.html ./
COPY src ./src
COPY server ./server
COPY public ./public
RUN bun install --frozen-lockfile --verbose
RUN bun run build

## Production stage
FROM oven/bun:1.2.4-slim
WORKDIR /app

COPY --from=builder /app/package.json /app/bun.lock /app/tsconfig.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/server ./server

RUN bun install --frozen-lockfile --production --verbose

## Start it
EXPOSE 3000
ENV NODE_ENV production
CMD ["bun", "run", "--bun", "server/server.ts"] 
