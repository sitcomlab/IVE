FROM node:14-alpine as build

ENV NODE_ENV=production

# when a npm dependency has binary build steps, add: build-base python
RUN apk --no-cache --virtual .build add git
RUN npm install -g bower

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

COPY bower.json .bowerrc ./
RUN bower install --allow-root

COPY . /usr/src/app
# TODO: RM files not needed at runtime

FROM node:14-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app /usr/src/app
EXPOSE 5000
CMD [ "npm", "start" ]
