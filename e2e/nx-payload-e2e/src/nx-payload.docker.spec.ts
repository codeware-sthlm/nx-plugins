import {
  checkFilesExist,
  ensureNxProject,
  tmpProjPath,
  uniq
} from '@nx/plugin/testing';

import { buildImage } from './utils/build-image';
import { runNxCommandAsync } from './utils/run-nx-command-async';

describe('Build app Dockerfile', () => {
  let appName: string;

  /** Application generate command without arguments */
  const baseCmd = 'generate @nx-plugins/nx-payload:app';

  console.log = jest.fn();
  jest.setTimeout(900_000);

  beforeAll(() => {
    ensureNxProject('@nx-plugins/nx-payload', 'dist/packages/nx-payload');
  });

  afterAll(async () => {
    await runNxCommandAsync('reset');
  });

  it('should be able to build generated app docker image', async () => {
    appName = uniq('app');
    await runNxCommandAsync(
      `${baseCmd} ${appName} --directory apps/${appName}`
    );

    expect(() => checkFilesExist(`apps/${appName}/Dockerfile`)).not.toThrow();

    const error = await buildImage({
      context: tmpProjPath(),
      dockerfile: `apps/${appName}/Dockerfile`
    });

    expect(error).toBeNull();
  });
});
