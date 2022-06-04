FROM node:17 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY tsconfig*.json ./
COPY src src
RUN yarn build
COPY src/images build/images/

FROM node:17
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY --from=builder /usr/src/app/build build
WORKDIR /usr/src/app/build
CMD ["node", "index.js"]