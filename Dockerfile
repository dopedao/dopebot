FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install --production==true
COPY . .
CMD ["node", "."]