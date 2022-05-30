FROM node:18
WORKDIR /usr/src
COPY package*.json ./
RUN yarn install --production==true
COPY . .
RUN yarn build
CMD ["node", "build/src"]