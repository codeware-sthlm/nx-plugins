import { execSync } from 'child_process';
import { existsSync, mkdirSync, readdirSync, rmSync } from 'fs';
import { join } from 'path';

import { Arguments } from '@nx-plugins/create-nx-payload';
import { runCommandAsync } from '@nx-plugins/e2e/utils';
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
      appName: 'test-app',
      appDirectory: 'apps/test-app',
      nxCloud: false,
      packageManager: 'npm'
    };

    it('should be created and installed', () => {
      const workspaceDirectory = ensureTestWorkspace(key, options);
      addWorkspaceDirectory(workspaceDirectory);

      // npm ls will fail if the package is not installed properly
      execSync('npm ls @cdwr/nx-payload', {
        cwd: workspaceDirectory,
        stdio: 'inherit'
      });
    });

    // TODO: Getting "ECONNREFUSED" during `npm install` in Dockerfile, using local Verdaccio registry
    it.skip('should be able to dx-launch app', async () => {
      const workspaceDirectory = ensureTestWorkspace(key, options);
      addWorkspaceDirectory(workspaceDirectory);

      await runCommandAsync(`nx dx:launch test-app`, {
        cwd: workspaceDirectory,
        env: process.env
      });

      expect((await agent('http://localhost:3000').get('/')).statusCode).toBe(
        200
      );

      expect(
        await runCommandAsync(`nx dx:down test-app`, {
          cwd: workspaceDirectory,
          env: process.env
        })
      ).toBeTruthy();
    });
  });
});

/**
 * Ensure a test workspace gets created using `create-nx-payload` with registry tag `e2e`.
 *
 * Require `tools/scripts/start-local-registry.ts` to have been executed in Jest `globalSetup`.
 *
 * @param e2eKey Preserve workspace for tests using the same preset options
 * @param options Preset options only needed when creating a new test workspace
 *
 * @returns The directory where the test workspace was created or reused
 */
function ensureTestWorkspace(e2eKey: string, options?: Arguments) {
  const tempDir = join(process.cwd(), 'tmp', `e2e.${e2eKey}`);

  // Check whether test workspace should be reused
  if (existsSync(tempDir)) {
    const workspaceName = readdirSync(tempDir, {
      encoding: 'utf-8',
      withFileTypes: true
    })
      .filter((d) => d.isDirectory)
      .map((d) => d.name)
      .at(0);

    if (workspaceName) {
      const workspaceDir = join(tempDir, workspaceName);
      console.log(`Reuse existing test workspace "${workspaceDir}"`);
      return workspaceDir;
    }
  }

  const workspaceName = options['name'];
  const workspaceDir = join(tempDir, workspaceName);

  // Ensure temporary dir is created and empty
  rmSync(workspaceDir, {
    recursive: true,
    force: true
  });
  mkdirSync(tempDir, { recursive: true });

  const commandOptions = Object.keys(options)
    .filter((key) => key !== 'name')
    .filter((key) => options[key] !== undefined)
    .map((key) => `--${key}=${options[key]}`)
    .join(' ');

  const command = `npx --yes create-nx-payload@e2e ${workspaceName} ${commandOptions}`;

  console.log(`Test command: "${command}"`);

  execSync(command, {
    cwd: tempDir,
    stdio: 'inherit',
    env: process.env
  });

  console.log(`Created test workspace in "${workspaceDir}"`);

  return workspaceDir;
}
