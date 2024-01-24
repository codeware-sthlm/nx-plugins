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
  <a href="https://github.com/codeware-sthlm/nx-plugins/actions/workflows/release.yml?query=branch:master"><img alt="Test state" src="https://github.com/codeware-sthlm/nx-plugins/actions/workflows/release.yml/badge.svg?branch=master"></a>
  &nbsp;
  <a href="https://github.com/codeware-sthlm/nx-plugins/actions/workflows/ci.yml?query=branch%3Amaster"><img alt="Test state" src="https://github.com/codeware-sthlm/nx-plugins/actions/workflows/ci.yml/badge.svg?branch=master"></a>
  &nbsp;
  <a href="https://codecov.io/gh/codeware-sthlm/nx-plugins"><img src="https://codecov.io/gh/codeware-sthlm/nx-plugins/graph/badge.svg?token=70BMKT2097"/></a>
  &nbsp;
  <a href='https://opensource.org/licenses/MIT'><img src='https://img.shields.io/badge/License-MIT-green.svg' alt='MIT'></a>
  <br />
  <br />
</p>

## Packages

| Package                                           | Description                                                                                              |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [`@cdwr/nx-payload`](packages/nx-payload)         | Support for [Payload](https://payloadcms.com) in your [Nx](https://nx.dev) workspace                     |
| [`create-nx-payload`](packages/create-nx-payload) | Quickly create a new [Nx](https://nx.dev) workspace with a [Payload](https://payloadcms.com) application |

## Quickstart Overview

### Create a workspace with a Payload application

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

Nx has great support for package managers. You can get started with the package manager you love the most.

```sh
yarn create nx-payload
```

```sh
pnpm create nx-payload
```
