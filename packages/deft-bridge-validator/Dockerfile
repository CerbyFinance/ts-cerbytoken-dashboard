FROM node:12.14.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install --prod

COPY . .

EXPOSE 3001

ENTRYPOINT ["yarn", "prod:start-server"]
CMD []
