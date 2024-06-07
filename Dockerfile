FROM node:alpine

WORKDIR /app

COPY package.json .

RUN npm install -g pnpm

RUN pnpm install
RUN pnpm install @mainmicro/jscommonlib
COPY . .
RUN chmod +x ./entrypoint.sh
ENTRYPOINT [ "sh","entrypoint.sh" ]