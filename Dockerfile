FROM node:20.17.0-bullseye-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ENV PORT=3000

RUN corepack enable

COPY . /app
WORKDIR /app

FROM base AS prod-deps

RUN --mount=type=cache,id=s/05dd2559-cde7-4923-b25b-ef4cce75a0e2-pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build

RUN --mount=type=cache,id=s/05dd2559-cde7-4923-b25b-ef4cce75a0e2-pnpm,target=/pnpm/store pnpm install --frozen-lockfile && \
    pnpm run build

FROM base

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

EXPOSE $PORT

CMD [ "node", "./dist/index.js" ]
