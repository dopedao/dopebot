FROM node:18
WORKDIR /usr/src
COPY package*.json ./
RUN yarn install --production==true
RUN yarn build
COPY /build/src .
CMD ["node", "build/src"]