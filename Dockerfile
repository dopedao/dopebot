FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apt-get update && apt-get install -y fontconfig && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY . .

FROM base as prod-deps
RUN pnpm install --prod --frozen-lockfile


FROM base as build
RUN pnpm install --frozen-lockfile
RUN pnpm tsc

COPY src/images build/images/


FROM base
COPY --from=prod-deps /usr/src/app/node_modules node_modules
COPY --from=build /usr/src/app/build build

WORKDIR /usr/src/app/build
CMD ["node", "index.js"]

