ARG BUN_VERSION=1.2.2
ARG NODE_VERSION=20

FROM imbios/bun-node:${BUN_VERSION}-${NODE_VERSION}-alpine AS base

FROM base AS builder

WORKDIR /builder

COPY bun.lock package.json ./
RUN bun install --frozen-lockfile
COPY . .

ARG PUBLIC_POCKETBASE_URL
ARG REDIS_URI
ARG POCKETBASE_ADMIN_EMAIL
ARG POCKETBASE_ADMIN_PW
ENV ORIGIN

RUN bun run build

# RUN rm -rf node_modules && \
#  rm -rf /root/.bun/install/cache/ && \
#  bun install --frozen-lockfile --production

FROM base AS dist

WORKDIR /app

COPY --from=builder /builder/node_modules ./node_modules
COPY --from=builder /builder/build ./build
COPY --from=builder /builder/package.json .

user bun

EXPOSE 3000

ENV NODE_ENV=production
ENV ORIGIN

CMD [ "bun", "./build/index.js"]