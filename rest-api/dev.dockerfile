FROM node:16-alpine

RUN yarn global add nodemon

RUN mkdir src
WORKDIR /src
COPY package.json /src/package.json
COPY ./dist /src/dist
RUN yarn install

EXPOSE 3000

CMD [ "nodemon", "-L", "/src/dist/index.js" ]