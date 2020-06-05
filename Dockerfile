FROM node:12.4.0-alpine

RUN apk add --update \
    curl \
    && rm -rf /var/cache/apk/*

WORKDIR /server

COPY . /server
RUN apk add git python make
RUN npm install

#SET TIME ZONE
ENV TZ=America/Sao_Paulo
RUN apk update && apk upgrade && \
  apk add --update tzdata
RUN rm -rf /var/cache/apk/*

EXPOSE 3030
CMD [ "npm", "start" ]
