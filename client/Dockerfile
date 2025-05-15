FROM node@sha256:37712740dc486f179b9540be1c6703cef3f805ea932573a007db748b71189afe as build

RUN apk update
WORKDIR /usr/app
COPY . .
RUN npm install
RUN npm run build

FROM nginx@sha256:5e36bd7a8adfe291560a6849d3125438fbe244f29a567522099caceef32bce54 as production

COPY --from=build /usr/app/build /usr/share/nginx/html

CMD [ "nginx", "-g", "daemon off;" ]
