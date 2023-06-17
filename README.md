## setup

- At packages/pulumi-component-dcdk
  - make install build_python_sdk
- When running pulumi setup PYTHONPATH to include the gnereated sdk e.g. export PYTHONPATH=packages/pulumi-component-dcdk/sdk/python/bin

## pulumi deps management

- modified from [pulumi offiical example](https://github.com/pulumi/pulumi-component-provider-ts-boilerplate)which has go dependnecy on codegen
- we have to build the pulumi sdk with codegen
- as a hack we use turbo repo internal pacakges and link to sdk/nodejs/index.ts

- compile to binary is necesary for pulumi to pick up
- for faster development cycles, ensure provider and adapter is unit tested

- For now we will use single provider for all related resources (IPFS, bacalhau etc)
- and strategy patterns to delgate until we observe need for dynamic swapping provider
- https://www.pulumi.com/blog/disable-default-providers/

## organization

- goal is to extra common libraries to packages/dcdk-adapters
  - while currently there is deps hell with `pkg`

# Turborepo Docker starter

This is an official Docker starter Turborepo.

## Using this example

Run the following command:

```sh
npx create-turbo@latest -e with-docker
```

## What's inside?

This turborepo uses [Yarn](https://classic.yarnpkg.com/lang/en/) as a package manager. It includes the following packages/apps:

### Apps and Packages

- `web`: a [Next.js](https://nextjs.org/) app
- `api`: an [Express](https://expressjs.com/) server
- `ui`: ui: a React component library
- `logger`: Isomorphic logger (a small wrapper around console.log)
- `tsconfig`: tsconfig.json;s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Docker

This repo is configured to be built with Docker, and Docker compose. To build all apps in this repo:

```
# Create a network, which allows containers to communicate
# with each other, by using their container name as a hostname
docker network create app_network

# Build prod using new BuildKit engine
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose -f docker-compose.yml build

# Start prod in detached mode
docker-compose -f docker-compose.yml up -d
```

Open http://localhost:3000.

To shutdown all running containers:

```
# Stop all running containers
docker kill $(docker ps -q) && docker rm $(docker ps -a -q)
```

### Remote Caching

This example includes optional remote caching. In the Dockerfiles of the apps, uncomment the build arguments for `TURBO_TEAM` and `TURBO_TOKEN`. Then, pass these build arguments to your Docker build.

You can test this behavior using a command like:

`docker build -f apps/web/Dockerfile . --build-arg TURBO_TEAM=“your-team-name” --build-arg TURBO_TOKEN=“your-token“ --no-cache`

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Jest](https://jestjs.io) test runner for all things JavaScript
- [Prettier](https://prettier.io) for code formatting
