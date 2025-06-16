FROM node:22.16.0 AS builder

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/

RUN apt-get update && apt-get install -y build-essential python3

RUN npm ci
COPY . .

FROM node:22.16.0-alpine as main

WORKDIR /app
COPY --from=builder /app /app

RUN apk --no-cache add --virtual builds-deps build-base python3 \
    && npm rebuild bcrypt --build-from-source \
    && apk del builds-deps

CMD ["npm", "run", "start:dev-with-migrations"]
EXPOSE ${PORT}
