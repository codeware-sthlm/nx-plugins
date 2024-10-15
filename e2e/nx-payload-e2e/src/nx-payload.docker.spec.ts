import { checkFilesExist, runNxCommand, tmpProjPath } from '@nx/plugin/testing';
import { dockerBuild, logError } from '@nx-plugins/core';
import {
  ensureCreateNxWorkspaceProject,
  ensureDockerConnectToLocalRegistry
} from '@nx-plugins/e2e/utils';

describe('Build app Dockerfile', () => {
  let appName: string;

  jest.setTimeout(1000_000);

  beforeAll(() => {
    const project = ensureCreateNxWorkspaceProject('@cdwr/nx-payload');
    appName = project.appName;

    ensureDockerConnectToLocalRegistry(appName);
  });

  afterAll(() => {
    runNxCommand('reset');
  });

  it('should hava a Dockerfile', async () => {
    expect(() => checkFilesExist(`apps/${appName}/Dockerfile`)).not.toThrow();
  });

  it('should build docker image', async () => {
    let error = null;
    try {
      await dockerBuild(
        {
          context: tmpProjPath(),
          dockerfile: `apps/${appName}/Dockerfile`,
          name: appName,
          tag: 'e2e'
        },
        true
      );
    } catch (err) {
      logError('Failed to build docker image', err.message);
      error = err;
    }

    expect(error).toBeNull();
  });
});
