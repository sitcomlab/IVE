FROM node:carbon
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

RUN apt-get update -qq
RUN apt-get install -y -qq git curl wget

# install npm
RUN apt-get install -y -qq npm
RUN ln -s /usr/bin/nodejs /usr/bin/node

# install bower
RUN npm install --global bower

COPY package*.json ./
COPY bower*.json ./

COPY setup*.js ./
COPY .bowerrc ./
COPY .env ./
RUN mkdir /queries
RUN mkdir /queries/setup
ADD queries/setup/* ./queries/setup/

RUN npm install
RUN bower install --allow-root

# Bundle app source
COPY . .

EXPOSE 5000

# Start the application:
CMD [ "npm", "start" ]