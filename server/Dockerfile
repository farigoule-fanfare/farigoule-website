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

FROM node:alpine AS production

RUN apk update && \
    apk add --no-cache python3

WORKDIR /usr/app

COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/package.json .
COPY --from=builder /usr/app/package-lock.json .
COPY controllers ./controllers
COPY routes ./routes
COPY services ./services
COPY repositories ./repositories
COPY middleware ./middleware
COPY index.js .

RUN mkdir -p ./public/uploads/carousel ./public/uploads/fanfarons ./database

CMD [ "node", "index.js" ]
