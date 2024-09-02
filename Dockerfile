# TODO:
# - Add a multi-stage build to reduce the size of the final image
# - Add a cache for the pnpm store
# - Add a cache for the node_modules
# - Add a cache for the playwright installation
# - Add a cache for the build
# - Add a cache for the dist folder
# - Add a cache for the pnpm store
# - Add a cache for the node_modules
# - Add a cache for the playwright installation
# - Add a cache for the build
# - Add a cache for the dist folder
# - Do not use the root user
# - Use a non-root user
# - Reduce the size of the final image

FROM node:20.17.0-bullseye-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ENV PORT=4000

RUN corepack enable

COPY . /app
WORKDIR /app

FROM base AS prod-deps 

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile && \
    pnpm run build

FROM ubuntu:noble-20240801

WORKDIR /app

COPY --from=base /usr/local/bin /usr/local/bin
COPY --from=base /usr/local/lib/node_modules /usr/local/lib/node_modules

COPY --from=base /app/package.json /app/package.json
COPY --from=build /app/dist /app/dist
COPY --from=prod-deps /app/node_modules /app/node_modules

RUN ln -s /usr/local/bin/node /usr/bin/node && \
    ln -s /usr/local/bin/npx /usr/bin/npx && \
    apt-get update && \
    npx playwright install --with-deps chromium && \
    rm -rf /var/lib/apt/lists/* && \
    apt-get autoremove -y && \
    apt-get clean && \
    apt-get autoclean

EXPOSE $PORT

CMD ["node", "./dist/index.js"]
