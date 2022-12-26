# Nx with Payload CMS <!-- omit in toc -->

Support for [Payload CMS](https://payloadcms.com) in your [Nx](https://nx.dev) workspace.

<p style="display:flex; gap:32px; align-items:center; margin-top:32px;">
<img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" height="200">
<span style="font-size:32px;">+</span>
<img src="https://avatars.githubusercontent.com/u/62968818?s=200&v=4" height="250">
</p>

## Contents <!-- omit in toc -->

- [Prerequisites](#prerequisites)
- [Recommended](#recommended)
- [Getting started](#getting-started)
- [Executors](#executors)
- [Generators](#generators)

## Prerequisites

You have previously created a Nx workspace of choice.

👉 <https://nx.dev/getting-started>

### Mongo Database <!-- omit in toc -->

Payload requires a running Mongo instance to work properly. For production MongoDB Atlas is a good choice but for local test and development, a local Docker container is perhaps better.

```sh
docker run --rm -d -p 27017:27017 mongo
```

## Recommended

### Global install `nx` <!-- omit in toc -->

```sh
npm install --global nx
```

Commands below assume `nx` is installed globally. Otherwise append `yarn` or `npx`.

```sh
yarn nx ...
npx nx ...
```

## Getting started

### Install Plugin <!-- omit in toc -->

```sh
# npm
npm i @cws-tools/nx-payload --save-dev

# yarn
yarn add @cws-tools/nx-payload --dev
```

### Generate Payload Admin Application <!-- omit in toc -->

```sh
nx g @cws-tools/nx-payload:application payload-app
```

### Serve Application <!-- omit in toc -->

```sh
nx serve payload-app
```

## Executors

Run tasks.

Todo...

## Generators

Generate code.

### init _(internal)_ <!-- omit in toc -->

Initialize the `@cws-tools/nx-payload` plugin.

| Option         | Type   | Required | Default | Description              |
| -------------- | ------ | -------- | ------- | ------------------------ |
| unitTestRunner | string |          | `jest`  | Set `none` to skip tests |

### application <!-- omit in toc -->

Create a Payload admin application served by Express.

| Option         | Type   | Required | Default  | Description                                   |
| -------------- | ------ | -------- | -------- | --------------------------------------------- |
| directory      | string |          | `apps`   | The directory of the application              |
| name           | string | 💹       |          | The name of the application                   |
| tags           | string |          |          | Add tags to the application (comma separated) |
| unitTestRunner | string |          | `jest`   | Set `none` to skip tests                      |
| linter         | string |          | `eslint` | The tool to use for running lint checks       |
