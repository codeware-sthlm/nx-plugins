# Nx with Payload CMS <!-- omit in toc -->

Support for [Payload CMS](https://payloadcms.com) in your [Nx](https://nx.dev) workspace.

<div style="display:flex; flex-direction:row; gap:32px; align-items:center; margin:32px;">
  <img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" height="200" />
  <div style="font-size:32px;">+</div>
  <img src="https://avatars.githubusercontent.com/u/62968818?s=200&v=4" height="250" />
</div>

## Contents <!-- omit in toc -->

- [Prerequisites](#prerequisites)
- [Recommended](#recommended)
- [Getting started](#getting-started)
- [Running tests](#running-tests)
- [Executors](#executors)
- [Generators](#generators)

## Prerequisites

- Node 18 or later
- Docker compose (to start app bundle)

You have previously created a Nx workspace supporting integrated repos.

👉 <https://nx.dev/getting-started>

```sh
# Quick start
npx create-nx-workspace@latest myorg --preset=ts
```

### Mongo Database <!-- omit in toc -->

Payload requires a running Mongo instance to work properly.

Production deployments must use something stable, for example [MongoDB Atlas](https://www.mongodb.com/atlas).
But for local test and development it's very easy and flexible to start MongoDB in a local Docker container instead.

## Recommended

### Global install `nx` <!-- omit in toc -->

```sh
npm install --global nx
```

Commands can now start with `nx` directly.

## Getting started

### Install Plugin <!-- omit in toc -->

```sh
# npm
npm install --save-dev @codeware-sthlm/nx-payload

# yarn
yarn add -D @codeware-sthlm/nx-payload
```

### Generate Payload admin application <!-- omit in toc -->

> ℹ️ `apps/demo` will be used as example in the readme
>
> 💡 Application name and path are generated using `as-provided`.
>
> <https://nx.dev/deprecated/as-provided-vs-derived#generate-paths-and-names>

```sh
nx g @codeware-sthlm/nx-payload:application demo --directory apps/demo
```

### Serve application <!-- omit in toc -->

Run MongoDB in Docker and application in dev mode.

#### Descide where your MongoDB is hosted <!-- omit in toc -->

1. Start in a local Docker container (development)

   ```sh
   docker run --rm -d -p 27017:27017 mongo
   ```

2. Custom hosting (production/staging/test)

   Edit `apps/demo/.env` and set environment variable `MONGO_URL` to the instance of choice.

#### Dev mode <!-- omit in toc -->

```sh
nx serve demo
```

Open browser to `http://localhost:3000` and setup your first user.

### Launch application bundle <!-- omit in toc -->

Run MongoDB and application in Docker with Docker Compose.

```sh
docker compose -f apps/demo/docker-compose.yml up -d
```

Open browser to `http://localhost:3000` and setup your first user.

## Running tests

```sh
# Unit test
nx test demo

# Linting
nx lint demo
```

## Executors

None.

## Generators

Generate code.

### init _(internal)_ <!-- omit in toc -->

Initialize the `@codeware-sthlm/nx-payload` plugin.

| Option         | Type   | Required | Default | Description              |
| -------------- | ------ | -------- | ------- | ------------------------ |
| unitTestRunner | string |          | `jest`  | Set `none` to skip tests |

### application <!-- omit in toc -->

Create a Payload admin application served by Express.

| Option         | Type    | Required           | Default  | Description                                   |
| -------------- | ------- | ------------------ | -------- | --------------------------------------------- |
| name           | string  | :heavy_check_mark: |          | Name of the application                       |
| directory      | string  | :heavy_check_mark: |          | Path to the application                       |
| tags           | string  |                    |          | Add tags to the application (comma separated) |
| unitTestRunner | string  |                    | `jest`   | Set `none` to skip tests                      |
| linter         | string  |                    | `eslint` | The tool to use for running lint checks       |
| skipE2e        | boolean |                    | `false`  | Do not create e2e application                 |

> 💡 `name` can be provided via option `--name` or as the first argument (used in the examples in this readme)
