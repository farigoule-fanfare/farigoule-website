FROM node:24-alpine3.21

RUN apk update
WORKDIR /usr/app/
COPY . .
RUN npm install --production --loglevel=warn

ENTRYPOINT [ "node", "index.js" ]