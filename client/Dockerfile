FROM node:lts-alpine3.24 AS deps
WORKDIR /usr/app
COPY package*.json ./
RUN apk update
RUN --mount=type=cache,target=/root/.npm \
    npm install

FROM node:lts-alpine3.24 AS build
WORKDIR /usr/app
COPY --from=deps /usr/app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM caddy:2-alpine AS production
COPY --from=build /usr/app/build /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile
