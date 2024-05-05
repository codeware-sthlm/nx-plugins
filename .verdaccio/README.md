# Custom Verdaccio Docker image

## Usage

Build image from root

```sh
docker build -f .verdaccio/Dockerfile -t verdaccio:local .
```

and run

```sh
docker run -it --rm --name verdaccio-local -p 4873:4873 verdaccio:local
```

## Npm configuration

**Get** original registry

```sh
npm config get registry --location user
```

**Set** local registry and token

```sh
npm config set registry http://localhost:4873 --location user
npm config set //localhost:4873/:_authToken="secretVerdaccioToken" --location user
```

**Reset** to original registry and delete local token

```sh
npm config set registry ${originalRegistry} --location user
npm config delete registry //localhost:4873/:_authToken --location user
```

## Yarn configuration

Config name is `registry` for **Yarn 1** and `npmRegistryServer` for **Yarn 2+**.

When `location` is `user` use flag `--home` where applicable.

Get current registry

```sh
yarn config get {configName}
```

Set local registry

```sh
yarn config set {configName} http://localhost:4873/ [--home]
```

Clear

```sh
yarn config unset {configName} [--home]
# Yarn 1: "delete" instead of "unset"
```

### Whitelist (Yarn 2+)

Get whitelist (probably empty)

```sh
yarn config get unsafeHttpWhitelist --json
```

```sh
yarn config set unsafeHttpWhitelist --json '{currentWhitelist} localhost' [--home]
```

Reset

```sh
yarn config unset npmRegistryServer [--home]
yarn config unset unsafeHttpWhitelist [--home]
```
