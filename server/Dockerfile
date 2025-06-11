FROM node:alpine AS builder

RUN apk update && \
    apk add --no-cache \
    python3 \
    py3-setuptools \
    py3-pip \
    make \
    g++

WORKDIR /usr/app/
COPY package*.json ./
RUN npm install --omit=dev --loglevel=warn
COPY . .

CMD [ "node", "index.js" ]
