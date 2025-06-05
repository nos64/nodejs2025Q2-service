FROM node:22.16.0 AS builder

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
COPY . .

FROM node:22.16.0-alpine as main

WORKDIR /app
COPY --from=builder /app /app

CMD ["npm", "run", "start:dev-with-migrations"]
EXPOSE ${PORT}
