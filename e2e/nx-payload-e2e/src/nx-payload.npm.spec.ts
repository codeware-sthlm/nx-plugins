import { runCommandAsync, runNxCommand } from '@nx/plugin/testing';
import { ensureCreateNxWorkspaceProject } from '@nx-plugins/e2e/utils';
import { agent } from 'supertest';

describe('Verify local npm and create empty workspace', () => {
  jest.setTimeout(900_000);

  beforeAll(() => {
    ensureCreateNxWorkspaceProject({ preset: 'apps' });
  });

  afterAll(() => {
    runNxCommand('reset', { silenceError: true });
  });

  it('should be connected to local registry', () => {
    return agent('http://localhost:4873').get('/').expect(200);
  });

  it('should have installed nx workspace', async () => {
    await runCommandAsync('npm ls @nx/workspace');
  });

  it('should not have installed nx-payload plugin', async () => {
    // npm ls will fail if the package is not installed properly
    // `> spawn /bin/sh ENOENT`
    const { stderr, stdout } = await runCommandAsync(
      'npm ls @cdwr/nx-payload',
      {
        silenceError: true
      }
    );

    expect(`${stderr}${stdout}`).toContain('(empty)');
  });
});
