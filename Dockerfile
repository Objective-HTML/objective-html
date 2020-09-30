FROM node:12-alpine AS BUILD_IMAGE

WORKDIR /usr/src/app

COPY src src
COPY webpack.config.js webpack.config.js
COPY package.json package.json
COPY tsconfig.json tsconfig.json
COPY sample sample

RUN npm i typescript fs ts-loader webpack webpack-cli @types/chai @types/mocha @types/expect @types/node --save
RUN ./node_modules/.bin/webpack-cli

RUN rm -rf ./node_modules/
RUN rm -rf ./src/
RUN rm -rf package.json
RUN rm -rf tsconfig.json

FROM node:12-alpine

WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist
COPY --from=BUILD_IMAGE /usr/src/app/sample ./sample

CMD [ "node", "./dist/bundle.js" ]