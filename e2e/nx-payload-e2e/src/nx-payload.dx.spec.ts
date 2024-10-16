import { checkFilesExist, runNxCommand, tmpProjPath } from '@nx/plugin/testing';
import { runCommandWithPredicate } from '@nx-plugins/core';
import {
  ensureCleanupDockerContainers,
  ensureCreateNxWorkspaceProject,
  ensureDockerConnectToLocalRegistry,
  resetDocker,
  waitForDockerLogMatch
} from '@nx-plugins/e2e/utils';
import { agent } from 'supertest';

describe('Developer experience', () => {
  let appName: string;

  jest.setTimeout(900_000);

  beforeAll(async () => {
    const project = ensureCreateNxWorkspaceProject({
      preset: '@cdwr/nx-payload'
    });
    appName = project.appName;

    ensureDockerConnectToLocalRegistry(appName);
    await ensureCleanupDockerContainers();
  });

  afterAll(async () => {
    runNxCommand('reset', { silenceError: true });
    await resetDocker(appName);
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
      { cwd: tmpProjPath(), verbose: process.env.NX_VERBOSE_LOGGING === 'true' }
    );

    expect(
      output.includes(
        `Done compiling TypeScript files for project "${appName}"`
      )
    ).toBeTruthy();
    expect(output.includes(`[ started ] on port 3000 (test)`)).toBeTruthy();
  });

  it('should start application and navigate to page', async () => {
    const startLog = runNxCommand('start');
    expect(startLog).toContain('Successfully ran target start');

    await waitForDockerLogMatch({
      containerName: appName,
      matchString: 'Using DB adapter',
      timeoutSeconds: 10
    });

    const startResponse = await agent('http://localhost:3000').get('/');
    expect(startResponse.status).toBe(302);
    expect(startResponse.headers['location']).toBe('/admin');

    // Shut down
    const stopLog = runNxCommand('stop');
    expect(stopLog).toContain('Successfully ran target stop');

    let stopCode: string;
    try {
      await agent('http://localhost:3000').get('/');
    } catch (error) {
      stopCode = error['code'];
    }
    expect(stopCode).toBe('ECONNREFUSED');
  });

  it(`should build image using 'docker-build' target`, () => {
    const result = runNxCommand('docker-build');
    expect(result).toContain('Successfully ran target docker-build');
  });

  it.todo('should have a running mongo instance');
  it.todo('should open admin page and create a new user');
});
