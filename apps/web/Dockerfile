FROM oven/bun:1 AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y python3 build-essential

COPY package.json turbo.json bun.lock ./
COPY packages ./packages
COPY apps/web ./apps/web

RUN bun install
RUN bun turbo build --filter=web

FROM oven/bun:1 AS run
WORKDIR /app

COPY --from=builder /app/apps/web/build ./apps/web/build
COPY --from=builder /app/apps/web ./apps/web
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .
COPY --from=builder /app/bun.lock .

EXPOSE 3000
CMD ["bun", "run", "--cwd", "apps/web", "start"]
