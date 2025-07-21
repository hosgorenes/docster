FROM oven/bun:1 AS install

WORKDIR /app

COPY . .

RUN bun install
RUN bun turbo build

FROM install AS run

WORKDIR /app

COPY --from=install /app/turbo.json .
COPY --from=install /app/package.json .
COPY --from=install /app/apps/web/build apps/web/build

LABEL org.opencontainers.source=https://github.com/gokceno/docster/

EXPOSE 3000

ENTRYPOINT ["bun", "turbo"]
