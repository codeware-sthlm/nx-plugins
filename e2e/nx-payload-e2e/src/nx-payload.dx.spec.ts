import { checkFilesExist, runNxCommand } from '@nx/plugin/testing';
import { runCommandWithPredicate } from '@nx-plugins/core';
import { ensureCreateNxWorkspaceProject } from '@nx-plugins/e2e/utils';
import { agent } from 'supertest';

// TODO: Docker tests are getting "ECONNREFUSED" during `npm install` in Dockerfile, using local Verdaccio registry

describe('Developer experience', () => {
  let appName: string;

  jest.setTimeout(900_000);

  beforeAll(() => {
    const project = ensureCreateNxWorkspaceProject('@cdwr/nx-payload');
    appName = project.appName;
  });

  afterAll(() => {
    runNxCommand('reset');
  });

  it('should build application', () => {
    const result = runNxCommand(`build ${appName}`);
    expect(result).toContain('Successfully ran target build');

    expect(() =>
      checkFilesExist(
        `dist/apps/${appName}/build/index.html`,
        `dist/apps/${appName}/package.json`,
        `dist/apps/${appName}/src/main.js`
      )
    ).not.toThrow();
  });

  it('should test application', () => {
    const result = runNxCommand(`test ${appName}`);
    expect(result).toContain('Successfully ran target test');
  });

  it('should lint application', () => {
    const result = runNxCommand(`lint ${appName}`);
    expect(result).toContain('Successfully ran target lint');
  });

  it('should serve application', async () => {
    const output = await runCommandWithPredicate(
      `serve ${appName}`,
      (log) => log.includes('[ started ]'),
      { verbose: process.env.NX_VERBOSE_LOGGING === 'true' }
    );

    expect(
      output.includes(
        `Done compiling TypeScript files for project "${appName}"`
      )
    ).toBeTruthy();
    expect(output.includes(`[ started ] on port 3000 (test)`)).toBeTruthy();
  });

  it.skip('should be able to start app and database', async () => {
    runNxCommand('start');
    expect((await agent('http://localhost:3000').get('/')).statusCode).toBe(
      200
    );

    runNxCommand('stop');
    expect((await agent('http://localhost:3000').get('/')).statusCode).not.toBe(
      200
    );
  });

  it.skip(`should build image using 'docker-build' target`, () => {
    const result = runNxCommand('docker-build');
    expect(result).toContain('Successfully ran target docker:build');
  });

  it.todo('should have a running mongo instance');
  it.todo('should open admin page and create a new user');
});
