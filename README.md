<p align="center">
  <br />
  <img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" height="140" />&nbsp;&nbsp;&nbsp;&nbsp;<img width="200" src="./assets/cdwr-cloud.png" alt="codeware sthlm logo">
  <br />
  <br />
</p>

<h1 align='center'>Nx Plugins</h1>

<p align='center'>
  A collection of Nx plugins powered by Codeware Sthlm.
  <br />
  <br />
  <a href="https://github.com/codeware-sthlm/nx-plugins/actions/workflows/ci.yml?query=branch%3Amaster"><img alt="Test state" src="https://github.com/codeware-sthlm/nx-plugins/actions/workflows/ci.yml/badge.svg?branch=master"></a>
  &nbsp;
  <a href="https://codecov.io/gh/codeware-sthlm/nx-plugins"><img src="https://codecov.io/gh/codeware-sthlm/nx-plugins/graph/badge.svg?token=70BMKT2097"/></a>
  &nbsp;
  <a href='https://opensource.org/licenses/MIT'><img src='https://img.shields.io/badge/License-MIT-green.svg' alt='MIT'></a>
  <br />
  <br />
</p>

### ⚠️ This repository is no longer maintained!

Plugin source code has moved to [codeware](https://github.com/codeware-sthlm/codeware) repository.

## Plugins

### [`@cdwr/nx-payload`](packages/nx-payload)

Add support for [Payload](https://payloadcms.com) in your existing [Nx](https://nx.dev) workspace.

#### [`create-nx-payload`](packages/create-nx-payload)

Quickly create a new [Nx](https://nx.dev) workspace with a [Payload](https://payloadcms.com) application, using the plugin as a preset.

## Quickstart Overview

### Create a new workspace with a Payload application

```sh
npx create-nx-payload
```

or

```sh
npx create-nx-workspace --preset @cdwr/nx-payload
```

### Add Payload plugin to an existing workspace

```sh
npm add -D @cdwr/nx-payload
```

### Generate a Payload application

```sh
npx nx generate @cdwr/nx-payload:app
```

## What about `yarn` and `pnpm`?

Nx has great support for package managers. You can get started with the package manager you love the most. For example

```sh
yarn create nx-payload
```

```sh
pnpm create nx-payload
```

or

```sh
npx create-nx-workspace --pm yarn
```

```sh
npx create-nx-workspace --pm pnpm
```

> Read more about [Nx installation](https://nx.dev/getting-started/installation)

## Development

[Installing Nx globally](https://nx.dev/getting-started/installation#installing-nx-globally) has advantages and lets you focus on runing Nx commands, without worring about your current package manager.

### Run targets for all packages

```sh
nx run-many -t build lint test e2e
```

or shorter

```sh
nx run-many
```

### Run a target for a specific package

```sh
nx run [package]:[target] [options]
```

or use the shorter infix notation

```sh
nx [target] [package] [options]
```

### Publish and test a local Npm package

Packages can be published locally to a [Verdaccio](https://verdaccio.org) registry, to be able to run manual smoke tests complementing the automated tests.

Start Verdaccio and configure package managers for a local setup.

```sh
nx local-registry
```

The process will keep running in the current terminal.

> Quit the process to shutdown Verdaccio when needed, which will also restore the initial package manager setup

In another terminal build an publish all plugins to local Verdaccio registry.

```sh
nx local-registry:publish
```

Open <http://localhost:4873/> to view the packages.

It's now possible to test a plugin in a local scope.

For example

```sh
npx create-nx-payload@local
```
