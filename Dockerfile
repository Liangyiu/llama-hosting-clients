ARG BUN_VERSION=1.1.42

FROM oven/bun:${BUN_VERSION} AS builder

WORKDIR /app

COPY . .

RUN bun i
RUN bun run build

FROM oven/bun:${BUN_VERSION}

COPY --from=builder /app/build .

ENV PORT 3000
EXPOSE 3000

USER bun

CMD ["bun", "run", "start"]
