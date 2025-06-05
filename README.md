# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {https://github.com/nos64/nodejs2025Q2-service}
```

## Installing NPM modules

```
npm install
```

## Switching the branch

```
git checkout hls-part-2
```

## Rename .env.example to .env

```
Replace .env.example with .env
```

## Running application

```
docker compose up
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/api/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Database GUI

```
npm run prisma:generate
```
Launches Prisma Studio GUI on port 5555 for database management.
Access: http://localhost:5555

## Other scripts:

#### Full development setup: Starts PostgreSQL container, Generates Prisma Client, Applies migrations, Launches the app

```
npm run dev:docker
```

#### Starts development server with hot-reload (runs inside Docker container)

```
npm run dev:watch
```

#### Scans Docker images for vulnerabilities using Docker Scout

```
npm run docker:scan
```

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm test -- test/users.e2e.spec.ts
npm test -- test/artists.e2e.spec.ts
npm test -- test/albums.e2e.spec.ts
npm test -- test/favorites.e2e.spec.ts
npm test -- test/tracks.e2e.spec.ts
```

To run only one of all test suites

```
npm run test -- <path to suite>
```


### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
