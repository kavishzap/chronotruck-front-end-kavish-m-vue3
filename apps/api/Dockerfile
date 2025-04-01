FROM node:10

WORKDIR /api

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
