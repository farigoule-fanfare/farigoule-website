FROM node@sha256:37712740dc486f179b9540be1c6703cef3f805ea932573a007db748b71189afe AS deps
WORKDIR /usr/app
COPY package*.json ./
RUN apk update
RUN --mount=type=cache,target=/root/.npm \
    npm install

FROM node@sha256:37712740dc486f179b9540be1c6703cef3f805ea932573a007db748b71189afe AS build
WORKDIR /usr/app
COPY --from=deps /usr/app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM caddy:2-alpine AS production
COPY --from=build /usr/app/build /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile
