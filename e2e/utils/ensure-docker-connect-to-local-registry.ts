import { writeFileSync } from 'fs';

import { tmpProjPath, updateFile } from '@nx/plugin/testing';

/**
 * Ensure the generated application can connect to the local registry
 * and fetch the project plugins from a Docker build process.
 *
 * Support `npm`.
 *
 * @param appName Application name
 */
export const ensureDockerConnectToLocalRegistry = (appName: string): void => {
  const registry = {
    host: process.env['CDWR_E2E_VERDACCIO_HOST'],
    port: 4873,
    token: 'secretVerdaccioToken'
  };

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
      .replace(/(COPY package\.json) \.\//, '$1 .npmrc ./')
      .replace(
        /(COPY --from=builder.*package\.json.*\n)/,
        '$1COPY --from=builder /app/.npmrc ./\n'
      )
  );
};
