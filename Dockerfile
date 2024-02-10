FROM node:20-bookworm

WORKDIR /app

RUN apt-get update

COPY package.json package*.json ./
COPY . .

RUN npm i

CMD ["node", "index.js"]