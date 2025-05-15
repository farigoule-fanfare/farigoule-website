FROM node:24-alpine as build

RUN apk update
WORKDIR /usr/app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine as production

COPY --from=build /usr/app/build /usr/share/nginx/html

CMD [ "nginx", "-g", "daemon off;" ]

# FROM node:24-alpine as production
# RUN apk update
# WORKDIR /usr/app
# COPY --from=build /usr/app .
# RUN ls -lah
# RUN rm -rf node_modules
# RUN npm install --omit=dev --loglevel=warn
# RUN npm install -g serve
# CMD serve -p $PORT build
