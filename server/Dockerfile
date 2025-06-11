FROM node@sha256:37712740dc486f179b9540be1c6703cef3f805ea932573a007db748b71189afe

RUN apk update
WORKDIR /usr/app/
COPY . .
RUN npm install --omit=dev --loglevel=warn

CMD [ "node", "index.js" ]
