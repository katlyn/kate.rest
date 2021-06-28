FROM node:15-alpine AS api
WORKDIR /usr/build
RUN apk add --no-cache python make g++
COPY api/package.json api/package-lock.json /usr/build/
RUN npm install
COPY api /usr/build/
RUN npm run build

FROM node:15-alpine AS frontend
WORKDIR /usr/build
COPY frontend/package.json frontend/package-lock.json /usr/build/
RUN npm install
COPY frontend /usr/build/
RUN npm run build

FROM node:15-alpine
WORKDIR /usr/kate.rest
RUN apk add --no-cache --virtual .gyp python make g++
COPY api/package.json api/package-lock.json /usr/kate.rest/
RUN npm install
RUN apk del .gyp
COPY --from=api /usr/build/dist .
COPY --from=frontend /usr/build/dist ../frontend
CMD ["node", "index.js"]
