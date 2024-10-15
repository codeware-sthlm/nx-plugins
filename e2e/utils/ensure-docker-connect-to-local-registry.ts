import { fileExists, tmpProjPath, updateFile } from '@nx/plugin/testing';
import { logWarning } from '@nx-plugins/core';
import { writeFileSync } from 'fs-extra';

import { getE2EPackageManager } from './get-e2e-package-manager';

/**
 * Ensure the generated application can connect to the local registry
 * and fetch the project plugins from a Docker build process.
 *
 * Support `npm`, `pnpm` and `yarn` (Classic and Berry).
 *
 * @param appName Application name
 */
export const ensureDockerConnectToLocalRegistry = (appName: string): void => {
  const pm = getE2EPackageManager();

  const registry = {
    host: 'host.docker.internal',
    port: 4873,
    token: 'secretVerdaccioToken'
  };

  // NPM or PNPM
  if (pm === 'npm' || pm === 'pnpm') {
    writeFileSync(
      `${tmpProjPath()}/.npmrc`,
      `
registry=http://${registry.host}:${registry.port}
//${registry.host}:${registry.port}/:_authToken=${registry.token}
  `
    );

    // `.npmrc` is normally not required in `Dockerfile`
    updateFile(`apps/${appName}/Dockerfile`, (content) =>
      content
        .replace(/COPY package\.json/, 'COPY package.json .npmrc')
        .replace(
          /(COPY --from=builder.*package\.json.*\n)/,
          '$1COPY --from=builder /app/.npmrc ./\n'
        )
    );
    return;
  }

  // Yarn
  if (pm === 'yarn') {
    // Classic (1.x)
    if (fileExists(`${tmpProjPath()}/.yarnrc`)) {
      writeFileSync(
        `${tmpProjPath()}/.yarnrc`,
        `
registry "http://${registry.host}:${registry.port}"
//${registry.host}:${registry.port}/:_authToken "${registry.token}"
  `
      );
      return;
    }

    // Berry (2+)
    if (fileExists(`${tmpProjPath()}/.yarnrc.yml`)) {
      writeFileSync(
        `${tmpProjPath()}/.yarnrc.yml`,
        `
nodeLinker: node-modules

npmRegistryServer: "http://${registry.host}:${registry.port}"
npmAuthToken: "${registry.token}"

unsafeHttpWhitelist:
- ${registry.host}
  `
      );
      return;
    }
  }

  logWarning(
    `Package manager '${pm}' has no support for connecting to a local registry`
  );
};
