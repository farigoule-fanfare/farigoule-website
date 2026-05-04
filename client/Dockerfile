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

FROM nginx@sha256:5e36bd7a8adfe291560a6849d3125438fbe244f29a567522099caceef32bce54 AS production

RUN apk add --no-cache gettext

COPY nginx.conf.template /etc/nginx/nginx.conf.template

COPY --from=build /usr/app/build /usr/share/nginx/html

CMD ["sh", "-c", "envsubst '$$API_BACKEND_URL' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'" ]
