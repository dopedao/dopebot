FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /usr/src/app
COPY . .

FROM base as prod-deps
COPY package*.json ./
RUN pnpm install --prod --frozen-lockfile


FROM base as build
COPY tsconfig*.json ./
RUN pnpm install --frozen-lockfile
RUN pnpm tsc

COPY src/images build/images/


FROM base
COPY --from=prod-deps /usr/src/app/node_modules node_modules
COPY --from=build /usr/src/app/build build

WORKDIR /usr/src/app/build
CMD ["node", "index.js"]

