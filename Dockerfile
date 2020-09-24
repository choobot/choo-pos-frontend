# build stage
FROM node:lts-alpine as build-stage
ARG API_ENDPOINT

WORKDIR /app/

RUN apk add gettext

COPY ./app/package.json ./package.json
RUN npm install

COPY ./app/ ./

RUN envsubst '\$API_ENDPOINT' < config/prod.env.js > config/prod.env.js.tmp
RUN mv config/prod.env.js.tmp config/prod.env.js

RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./nginx/default.conf.template /etc/nginx/conf.d/default.conf.template
CMD /bin/sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'