<p align="center">
  <br />
  <img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" height="140" />&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://avatars.githubusercontent.com/u/62968818?s=200&v=4" height="150" />
  <br />
  <br />
</p>

<h1 align='center'>create-nx-payload</h1>

<p align='center'>
  Quickly create a new <a href='https://nx.dev'>Nx</a> workspace with a <a href='https://payloadcms.com'>Payload</a> application.
  <br />
  <br />
  <a href='https://www.npmjs.com/package/create-nx-payload'><img src='https://img.shields.io/npm/v/create-nx-payload?label=npm%20version' alt='create-nx-payload npm'></a>
  &nbsp;
  <a href='https://opensource.org/licenses/MIT'><img src='https://img.shields.io/badge/License-MIT-green.svg' alt='MIT'></a>
  <br />
  <br />
</p>

## Prerequisites

- Node 18 or later
- Docker compose (to use `dx:launch`)

## Usage

### Create a workspace with a Payload application

```sh
npx create-nx-payload
```

or

```sh
npx create-nx-workspace --preset @cdwr/nx-payload
```

### Launch Payload admin application

Go to the newly created workspace and launch the application and database in Docker

```sh
npx nx dx:launch
```

Open your browser and navigate to <http://localhost:3000> to setup your first user.

### Generate another Payload application

Since `@cdwr/nx-payload` is already installed, just call the generate command

```sh
npx nx generate @cdwr/nx-payload:app
```

See [`@cdwr/nx-payload`](https://github.com/codeware-sthlm/nx-plugins/tree/master/packages/nx-payload/README.md) for more details.
