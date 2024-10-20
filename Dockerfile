FROM node:20.18.0-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ENV PORT=4000

RUN corepack enable

COPY . /app
WORKDIR /app

# FROM base AS prod-deps 

# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile && \
    pnpm run build

FROM debian:bookworm-slim

WORKDIR /app

COPY --from=base /usr/local/bin/node /usr/local/bin/node
COPY --from=base /app/package.json /app/package.json

# COPY --from=base /usr/local/lib/node_modules /usr/local/lib/node_modules

# COPY --from=prod-deps /app/node_modules /app/node_modules

COPY --from=build /app/dist /app/dist

# RUN ln -s /usr/local/bin/node /usr/bin/node && \
#     ln -s /usr/local/bin/npm /usr/bin/npm && \
#     ln -s /usr/local/bin/pnpm /usr/bin/pnpm

RUN ln -s /usr/local/bin/node /usr/bin/node

# ENV PATH="/usr/local/bin:${PATH}"

EXPOSE 3000

CMD ["node", "./dist/index.js"]
