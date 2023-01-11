FROM node:16

WORKDIR /administration-backend

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .

RUN npm run build

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "dist/main"]