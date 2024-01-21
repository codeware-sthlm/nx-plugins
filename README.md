<p align="center">
  <br/>
    <img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" height="140" />
  </picture>
  <span style="margin:2rem;"></span>
  <picture>
    <img width="200" src="./assets/cdwr-cloud.png" alt="codeware sthlm logo">
  </picture>
  <br/><br/>
</p>

<h1 align='center'>Nx Plugins</h1>

<div align='center'>
  A collection of Nx plugins powered by Codeware Sthlm.
  <br/><br/>
  <a href="https://codecov.io/gh/codeware-sthlm/nx-plugins" >
    <img src="https://codecov.io/gh/codeware-sthlm/nx-plugins/graph/badge.svg?token=70BMKT2097"/>
  </a>
  <a href='https://opensource.org/licenses/MIT'>
    <img src='https://img.shields.io/badge/License-MIT-green.svg' alt='MIT'>
  </a>
  <br/><br/>
</div>

## Packages

| Package                                           | Description                                                                                              |                                                                                                                                                                               |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@cdwr/nx-payload`](packages/nx-payload)         | Support for [Payload](https://payloadcms.com) in your [Nx](https://nx.dev) workspace                     | <div><a href='https://www.npmjs.com/package/@cdwr/nx-payload'><img src='https://img.shields.io/npm/v/@cdwr/nx-payload?label=npm%20version' alt='@cdwr/nx-payload npm'></a>    |
| [`create-nx-payload`](packages/create-nx-payload) | Quickly create a new [Nx](https://nx.dev) workspace with a [Payload](https://payloadcms.com) application | <div><a href='https://www.npmjs.com/package/create-nx-payload'><img src='https://img.shields.io/npm/v/create-nx-payload?label=npm%20version' alt='create-nx-payload npm'></a> |

## Quickstart Overview

> All package managers supported by Nx can be used

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
npm install -D @cdwr/nx-payload
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
