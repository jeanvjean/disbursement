FROM node:14.15.1-alpine3.10 As builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

RUN npm install pm2 -g

COPY . .

EXPOSE 3008

CMD [ "node", "bin/app.js" ]