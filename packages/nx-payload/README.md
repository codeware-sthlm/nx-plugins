# Nx with Payload CMS <!-- omit in toc -->

> Adding support for [Payload CMS](https://payloadcms.com) in your [Nx](https://nx.dev) workspace.

<div style="display:flex; flex-direction:row; align-items:center; margin:2rem;">
  <picture>
    <img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" height="200" />
  </picture>
  <span style="font-size:2rem; margin:2rem;">+</span>
  <picture>
    <img src="https://avatars.githubusercontent.com/u/62968818?s=200&v=4" height="200" />
  </picture>
</div>

## Contents <!-- omit in toc -->

- [Prerequisites](#prerequisites)
- [Quickstart](#quickstart)
- [Adding to an existing Nx workspace](#adding-to-an-existing-nx-workspace)
- [Generators](#generators)
- [Migrations](#migrations)
- [Versions Compatibility](#versions-compatibility)

## Prerequisites

- Node 18 or later
- Docker compose (to be able to start app dev bundle)

### Recommended <!-- omit in toc -->

Install `nx` globally.

```sh
npm install --global nx
```

Commands can now use `nx` without specifying the package manager.

## Quickstart

### Generate a new workspace <!-- omit in toc -->

Create a new Nx workspace `my-workspace` with a Payload CMS admin application.

```sh
npx create-nx-payload my-workspace
```

Follow the interactive guide to get started.

-- or --

```sh
npx create-nx-workspace my-workspace --preset=@cdwr/nx-payload
```

### Launch Payload CMS admin application <!-- omit in toc -->

Enter the new workspace.

```sh
cd my-workspace
```

Launch Payload CMS admin application in Docker.

```sh
nx dx:launch [app]
```

> The generated app name can be ommited since it's set as the default app in `nx.json`. Provide your app name when needed.

Open your browser and navigate to <http://localhost:3000> to setup your first user.

## Adding to an existing Nx workspace

Install the Payload CMS plugin.

```sh
npm install -D @cdwr/nx-payload
```

Generate a Payload CMS admin application.

```sh
nx g @cdwr/nx-payload:app my-app --directory apps/my-app
```

Launch app as described in the [Quickstart](#quickstart) section.

## Generators

### init _(internal)_ <!-- omit in toc -->

Initialize the `@cdwr/nx-payload` plugin.

| Option         | Type   | Required | Default | Description              |
| -------------- | ------ | -------- | ------- | ------------------------ |
| unitTestRunner | string |          | `jest`  | Set `none` to skip tests |

### application <!-- omit in toc -->

Generate a Payload CMS admin application served by Express.

| Option         | Type    | Required | Default  | Description                                       |
| -------------- | ------- | :------: | -------- | ------------------------------------------------- |
| name           | string  |    ✅    |          | Name of the application                           |
| directory      | string  |    ✅    |          | Path to the application                           |
| tags           | string  |          |          | Add tags to the application (comma separated)     |
| unitTestRunner | string  |          | `jest`   | Set `none` to skip tests                          |
| linter         | string  |          | `eslint` | The tool to use for running lint checks           |
| skipE2e        | boolean |          | `false`  | Whether to skip generating e2e application or not |

> 💡 `name` can be provided via option `--name` or as the first argument (used in the examples in this readme)

## Migrations

None.

## Versions Compatibility

| Plugin version | Nx version |
| -------------- | ---------- |
| ^1.0.0         | ^17.0.0    |
