import { cwd } from 'process';

import {
  checkFilesExist,
  ensureNxProject,
  runNxCommandAsync,
  tmpProjPath,
  uniq
} from '@nx/plugin/testing';
import { copy } from 'nx/src/native';

import { buildImage } from './utils/build-image';

describe('Build app Dockerfile', () => {
  const projPath = tmpProjPath().replace(`${cwd()}/`, '');

  console.log = jest.fn();
  jest.setTimeout(900_000);

  beforeAll(() => {
    // Dockerfile cannot find dist folder outside e2e test directory.
    // Setup as if the plugin was built inside the e2e test directory,
    // and make the dist folder copy afterwards.

    const projPluginDist = `${projPath}/dist/packages/nx-payload`;

    ensureNxProject('@cdwr/nx-payload', projPluginDist);
    copy('dist/packages/nx-payload', projPluginDist);
  });

  it('should be able to build generated app docker image', async () => {
    const appName = uniq('app');
    await runNxCommandAsync(
      `g @cdwr/nx-payload:app ${appName} --directory apps/${appName}`
    );

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
