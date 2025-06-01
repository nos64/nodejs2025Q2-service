FROM node:22.16-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:22.16-alpine
WORKDIR /app
COPY --from=build /app /app
EXPOSE ${PORT}
CMD ["npm", "run", "start:prod"]