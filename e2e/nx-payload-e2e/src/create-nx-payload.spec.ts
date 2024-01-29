import { execSync } from 'child_process';
import { rmSync } from 'fs';

import { type Arguments } from '@nx-plugins/create-nx-payload';
import { ensureTestWorkspace, runCommandAsync } from '@nx-plugins/e2e/utils';
import { agent } from 'supertest';

describe('create-nx-payload', () => {
  const workspaceDirectories: Array<string> = [];

  const addWorkspaceDirectory = (dir: string) => {
    if (!workspaceDirectories.includes(dir)) {
      workspaceDirectories.push(dir);
    }
  };

  console.log = jest.fn();
  jest.setTimeout(600_000);

  afterAll(() => {
    // Cleanup the test projects
    for (const dir of workspaceDirectories) {
      rmSync(dir, {
        recursive: true,
        force: true
      });
    }
  });

  it('should be connected to local registry', () => {
    return agent('http://localhost:4873').get('/').expect(200);
  });

  describe('create & launch', () => {
    const key = 'create-launch';

    const options: Arguments = {
      name: 'test-nx-payload',
      payloadAppName: 'test-app',
      payloadAppDirectory: 'apps/test-app',
      nxCloud: false,
      packageManager: 'npm'
    };

    it('should be created and installed', () => {
      const workspaceDirectory = ensureTestWorkspace(
        'create-nx-payload',
        key,
        options
      );
      addWorkspaceDirectory(workspaceDirectory);

      // npm ls will fail if the package is not installed properly
      execSync('npm ls @cdwr/nx-payload', {
        cwd: workspaceDirectory,
        stdio: 'inherit'
      });
    });

    // TODO: Getting "ECONNREFUSED" during `npm install` in Dockerfile, using local Verdaccio registry
    it.skip('should be able to dx-launch app', async () => {
      const workspaceDirectory = ensureTestWorkspace(
        'create-nx-payload',
        key,
        options
      );
      addWorkspaceDirectory(workspaceDirectory);

      await runCommandAsync(`nx start test-app`, {
        cwd: workspaceDirectory,
        env: process.env
      });

      expect((await agent('http://localhost:3000').get('/')).statusCode).toBe(
        200
      );

      expect(
        await runCommandAsync(`nx stop test-app`, {
          cwd: workspaceDirectory,
          env: process.env
        })
      ).toBeTruthy();
    });
  });
});
