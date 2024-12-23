# nodejs base image
#FROM node:18-buster as build-stage
FROM node:20.11.1-alpine3.19 as build-stage

# Conventional working directory
#run mkdir /usr/src/app

# set working directory
WORKDIR /usr/src/app

# exposing all our Node.js binaries
env PATH /usr/src/app/node_modules/.bin:$PATH

# Copy package.json
copy package.json /usr/src/app/package.json
copy package-lock.json /usr/src/app/package-lock.json

# install
RUN npm install 

# add app
copy . /usr/src/app

# start build app
RUN npm run build

# nginx base image
FROM nginx:stable-alpine as production-stage

# Remove default nginx static resources
RUN rm /etc/nginx/conf.d/default.conf

# copies conf to the container directory
COPY nginx/nginx.conf /etc/nginx/conf.d

# Set working directory to nginx resources directory
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]