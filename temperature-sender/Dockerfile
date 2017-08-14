#usa la imagen de node (última en dockerhub)
FROM node:latest
# copia (invalidando cache)
ADD package.json ./package.json
ADD package-lock.json ./package-lock.json
RUN npm install
# setea y/o crea el working directory
COPY sender.js .
RUN npm start
