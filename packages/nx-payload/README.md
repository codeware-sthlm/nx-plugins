<p align="center">
  <br/>
  <picture>
    <img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" height="140" />
  </picture>
  <span style="margin:2rem;"></span>
  <picture>
    <img src="https://avatars.githubusercontent.com/u/62968818?s=200&v=4" height="150" />
  </picture>
  <br/><br/>
</p>

<h1 align='center'>@cdwr/nx-payload</h1>

<div align='center'>
  Adding support for <a href='https://payloadcms.com'>Payload</a> in your <a href='https://nx.dev'>Nx</a> workspace.
  <br/><br/>
  <a href='https://www.npmjs.com/package/@cdwr/nx-payload'>
    <img src='https://img.shields.io/npm/v/@cdwr/nx-payload?label=npm%20version' alt='@cdwr/nx-payload npm'>
  </a>
  <a href='https://opensource.org/licenses/MIT'>
    <img src='https://img.shields.io/badge/License-MIT-green.svg' alt='MIT'>
  </a>
  <br/><br/>
</div>

## Contents <!-- omit in toc -->

- [Prerequisites](#prerequisites)
- [Usage](#usage)
- [You don't have an Nx workspace?](#you-dont-have-an-nx-workspace)
- [Plugin Generators](#plugin-generators)
- [Plugin Migrations](#plugin-migrations)
- [Versions Compatibility](#versions-compatibility)

## Prerequisites

- You have already created an Nx workspace
- Node 18 or later
- Docker compose (to use `dx:launch`)

## Usage

### Add Payload plugin to an existing workspace <!-- omit in toc -->

```sh
npm install -D @cdwr/nx-payload
```

### Generate a Payload application <!-- omit in toc -->

```sh
npx nx generate @cdwr/nx-payload:app
```

### Launch Payload admin and database in Docker <!-- omit in toc -->

Payload admin app and a Mongo database will run in each Docker container

```sh
npx nx dx:launch [app-name]
```

> App name doesn't have to be provided for the default app in `nx.json`. Provide the name when you have more apps and some other should be launched.

Open your browser and navigate to <http://localhost:3000> to setup your first user.

Mongo db connection string: `mongodb://mongo/{app-name}`.

#### Shutdown <!-- omit in toc -->

```sh
npx nx dx:down [app-name]
```

Database volumes are persistent, hence all data is available on next launch.

## You don't have an Nx workspace?

Just use the plugin create package to get started from scratch.

See [`create-nx-payload`](https://github.com/codeware-sthlm/nx-plugins/tree/master/packages/create-nx-payload/README.md) for more details.

## Plugin Generators

### `init` _(internal)_ <!-- omit in toc -->

Initialize the `@cdwr/nx-payload` plugin.

| Option           | Type   | Required | Default | Description              |
| ---------------- | ------ | -------- | ------- | ------------------------ |
| `unitTestRunner` | string |          | `jest`  | Set `none` to skip tests |

### `application` <!-- omit in toc -->

Alias: `app`

Generate a Payload admin application served by Express.

| Option           | Type    | Required | Default  | Description                                       |
| ---------------- | ------- | :------: | -------- | ------------------------------------------------- |
| `name`           | string  |    ✅    |          | Name of the application                           |
| `directory`      | string  |    ✅    |          | Path to the application files                     |
| `tags`           | string  |          | `''`     | Add tags to the application (comma separated)     |
| `unitTestRunner` | string  |          | `jest`   | Set `none` to skip tests                          |
| `linter`         | string  |          | `eslint` | The tool to use for running lint checks           |
| `skipE2e`        | boolean |          | `false`  | Whether to skip generating e2e application or not |

> 💡 `name` can be provided via option `--name` or as the first argument (used in the examples in this readme)

## Plugin Migrations

None.

## Versions Compatibility

| Plugin version | Nx version | Payload version |
| -------------- | ---------- | --------------- |
| `^0.1.0`       | `^17.0.0`  | `^2.5.0`        |
