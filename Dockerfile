FROM node:18 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY tsconfig*.json ./
COPY src src
RUN yarn build

FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY --from=builder /usr/src/app/build build/
WORKDIR /usr/src/app/build
CMD ["node", "index.js"]