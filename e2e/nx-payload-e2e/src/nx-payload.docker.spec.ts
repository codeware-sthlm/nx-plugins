import { cwd } from 'process';

import {
  checkFilesExist,
  ensureNxProject,
  runNxCommand,
  tmpProjPath,
  uniq
} from '@nx/plugin/testing';
import { copySync } from 'fs-extra';

import { buildImage } from './utils/build-image';

describe('Build app Dockerfile', () => {
  const appName = uniq('app');
  const projPath = tmpProjPath().replace(`${cwd()}/`, '');

  jest.setTimeout(900_000);

  beforeAll(() => {
    // Dockerfile cannot find dist folder outside e2e test directory.
    // Setup as if the plugin was built inside the e2e test directory,
    // and make the dist folder copy afterwards.

    const projPluginDist = `${projPath}/dist/packages/nx-payload`;

    ensureNxProject('@cdwr/nx-payload', projPluginDist);
    copySync('dist/packages/nx-payload', projPluginDist);

    runNxCommand(
      `g @cdwr/nx-payload:app ${appName} --directory apps/${appName}`
    );
  });

  afterAll(() => {
    runNxCommand('reset');
  });

  it('should be able to build generated app docker image', async () => {
    expect(() => checkFilesExist(`apps/${appName}/Dockerfile`)).not.toThrow();

    const error = await buildImage({
      context: tmpProjPath(),
      dockerfile: `apps/${appName}/Dockerfile`
    });

    if (error) {
      console.log(error);
    }

    expect(error).toBeNull();
  });
});
