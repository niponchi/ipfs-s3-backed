FROM node:9.3-alpine
RUN apk update && apk add python make g++ git

RUN mkdir -p /usr/app

WORKDIR /usr/app
VOLUME ["/usr/app"]