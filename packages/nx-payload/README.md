<p align="center">
  <br />
  <img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" height="140" />&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://avatars.githubusercontent.com/u/62968818?s=200&v=4" height="150" />
  <br />
  <br />
</p>

<h1 align='center'>@cdwr/nx-payload</h1>

<p align='center'>
  Adding support for <a href='https://payloadcms.com'>Payload</a> in your <a href='https://nx.dev'>Nx</a> workspace.
  <br />
  <br />
  <a href='https://www.npmjs.com/package/@cdwr/nx-payload'><img src='https://img.shields.io/npm/v/@cdwr/nx-payload?label=npm%20version' alt='@cdwr/nx-payload npm'></a>
  &nbsp;
  <a href='https://opensource.org/licenses/MIT'><img src='https://img.shields.io/badge/License-MIT-green.svg' alt='MIT'></a>
  <br />
  <br />
</p>

## Contents <!-- omit in toc -->

- [Prerequisites](#prerequisites)
- [Usage](#usage)
  - [Add Payload plugin to an existing workspace](#add-payload-plugin-to-an-existing-workspace)
  - [Generate a Payload application](#generate-a-payload-application)
  - [MongoDB, Postgres or Supabase?](#mongodb-postgres-or-supabase)
- [DX](#dx)
  - [Start Payload and database in Docker](#start-payload-and-database-in-docker)
  - [Start a local database instance of choice](#start-a-local-database-instance-of-choice)
  - [Serve Payload admin in development mode](#serve-payload-admin-in-development-mode)
  - [Run Payload commands](#run-payload-commands)
  - [Troubleshooting](#troubleshooting)
    - [I can't get Payload to start properly with Postgres in prod mode](#i-cant-get-payload-to-start-properly-with-postgres-in-prod-mode)
- [You don't have an Nx workspace?](#you-dont-have-an-nx-workspace)
- [Plugin Generators](#plugin-generators)
- [Plugin Migrations](#plugin-migrations)
- [Versions Compatibility](#versions-compatibility)

## Prerequisites

- You have already created an Nx workspace
- Node 18+
- Docker

## Usage

### Add Payload plugin to an existing workspace

```sh
npm add -D @cdwr/nx-payload
```

### Generate a Payload application

```sh
npx nx generate @cdwr/nx-payload:app
```

### MongoDB, Postgres or Supabase?

Payload has offlicial support for database adapters [MongoDB](https://www.mongodb.com/) and [Postgres](https://www.postgresql.org/about/).

This plugin support setting up of either one via option [`--database`](#plugin-generators).

> [Supabase](https://supabase.com/docs) should be setup using the Postgres adapter

Changing the adapter for a generated application must be done manually in `payload.config.ts`.

> We don't want to infer opinionated complexity into Payload configuration

Luckily it's fairly easy to change database and the required parts to replace are few.

```ts
// MongoDB @ payload.config.ts

import { mongooseAdapter } from '@payloadcms/db-mongodb';

export default buildConfig({
  db: mongooseAdapter({
    url: process.env.MONGO_URL,
    migrationDir: resolve(__dirname, 'migrations')
  })
});
```

```ts
// Postgres/Supabase @ payload.config.ts

import { postgresAdapter } from '@payloadcms/db-postgres';

export default buildConfig({
  db: postgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL
    },
    migrationDir: resolve(__dirname, 'migrations')
  })
});
```

More information can be found on the official [Payload Database](https://payloadcms.com/docs/database/overview) page.

## DX

Generated applications comes with a set of Nx targets to help you get started.

### Start Payload and database in Docker

This is the quickest way to get Payload up and running in no time.

Using docker compose, both MongoDB and Postgres are started in each container, as well as the Payload admin application.

```sh
npx nx start [app-name]
```

App name doesn't have to be provided for the default app in `nx.json`. Provide the name when you have more apps and some other should be launched.

Open your browser and navigate to <http://localhost:3000> to setup your first user.

> Supabase is not supported in this opinionated bundle, since it's actually better to start the preferred database manually and run Payload app in development mode

#### Stop <!-- omit in toc -->

Shutdown database and Payload containers.

```sh
npx nx stop [app-name]
```

Database volumes are persistent, hence all data is available on next launch.

### Start a local database instance of choice

It's better to start the preferred database first, to be properly initialized before Payload is served.

#### MongoDB <!-- omit in toc -->

Run MongoDB in Docker

```sh
npx nx mongodb
```

#### Postgres <!-- omit in toc -->

Run Postgres in Docker

```sh
npx nx postgres
```

#### Supabase <!-- omit in toc -->

Supabase has its own powerful toolset running [local dev with CLI](https://supabase.com/docs/guides/cli)

```sh
npx supabase init
```

```sh
npx supabase start
```

Edit `POSTGRES_URL` in `.env`.

### Serve Payload admin in development mode

Payload admin app is served in watch mode.

> The configured database must have been started, see [local database](#start-a-local-database-instance)

```sh
npx nx serve [app-name]
```

Open your browser and navigate to <http://localhost:3000>.

### Run Payload commands

All commands available from Payload can be used by the generated application via target `payload`.

```sh
npx nx payload [app-name] -- [payload-command]
```

This is specially useful for managing [migrations](https://payloadcms.com/docs/database/migrations#commands).

### Troubleshooting

#### I can't get Payload to start properly with Postgres in prod mode

Using Postgres in dev mode (serve) enables automatic migration. But when starting in prod mode it's turned off. So when the database is started without data, Payload will encounter errors once started (e.g. in Docker).

The solution is to run a migration on the database before Payload is started.

```sh
npx nx payload [app-name] -- migrate
```

**How do I create a migration file?**

Start Payload in dev mode to seed your collection data. Then create a migration file in a second terminal.

```sh
npx nx serve [app-name]
```

```sh
npx nx payload [app-name] -- migrate:create
```

View migration files

```sh
npx nx payload [app-name] -- migrate:status
```

## You don't have an Nx workspace?

Just use the plugin create package to get started from scratch.

See [`create-nx-payload`](https://github.com/codeware-sthlm/nx-plugins/tree/master/packages/create-nx-payload/README.md) for more details.

## Plugin Generators

### `init` _(internal)_ <!-- omit in toc -->

Initialize the `@cdwr/nx-payload` plugin.

_No options_.

### `application` <!-- omit in toc -->

Alias: `app`

Generate a Payload admin application served by Express.

| Option             | Type    | Required | Default   | Description                                         |
| ------------------ | ------- | :------: | --------- | --------------------------------------------------- |
| `--name`           | string  |    ✅    |           | Name of the application                             |
| `--directory`      | string  |    ✅    |           | Path to the application files                       |
| `--database`       | string  |          | `mongodb` | Preferred database to setup [`mongodb`, `postgres`] |
| `--tags`           | string  |          | `''`      | Add tags to the application (comma separated)       |
| `--unitTestRunner` | string  |          | `jest`    | Set `none` to skip tests                            |
| `--linter`         | string  |          | `eslint`  | The tool to use for running lint checks             |
| `--skipE2e`        | boolean |          | `false`   | Whether to skip generating e2e application or not   |

> 💡 `--name` can also be provided as the first argument (used in the examples in this readme)

## Plugin Migrations

None.

## Versions Compatibility

| Plugin version | Nx version | Payload version |
| -------------- | ---------- | --------------- |
| `^0.5.0`       | `~18.0.3`  | `^2.8.2`        |
| `^0.1.0`       | `^17.0.0`  | `^2.5.0`        |
