FROM node:12.14.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn global add pm2
RUN yarn install --prod

COPY ../ .

EXPOSE 3001

CMD ["yarn", "prod:start-server"]
