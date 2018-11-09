# FROM node:8.4
# USER node
# # RUN apt-get add --no-cache \
# #     git \
# #     build-base \
# #     g++ \
# #     python \
# #     curl

# RUN npm i -g ipfs

# WORKDIR /usr/src/app


FROM node:9.3-alpine
RUN apk update && apk add python make g++ git

# ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
# ENV PATH=/home/node/.npm-global;$PATH

RUN chown -R node:node /usr/local/lib/node_modules
RUN chown -R node:node /usr/local/bin

WORKDIR /app
COPY init-and-daemon.sh /app
RUN chown node:node /app
RUN chmod 755 /app/init-and-daemon.sh

USER node
RUN npm install -g ipfs

CMD sh ./init-and-daemon.sh