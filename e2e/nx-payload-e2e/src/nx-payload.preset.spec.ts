import { readFileSync, rmSync } from 'fs';

import { type Arguments } from '@nx-plugins/create-nx-payload';
import { agent } from 'supertest';

import { ensureTestWorkspace } from './utils/ensure-test-workspace';
import { runCommandAsync } from './utils/run-command-async';

describe('create workspace with preset', () => {
  const workspaceDirectories: Array<string> = [];

  const addWorkspaceDirectory = (dir: string) => {
    if (!workspaceDirectories.includes(dir)) {
      workspaceDirectories.push(dir);
    }
  };

  console.log = jest.fn();
  jest.setTimeout(600_000);

  afterAll(async () => {
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

  describe('create', () => {
    it('should be created and installed', async () => {
      const workspaceDirectory = await ensureTestWorkspace<
        Pick<
          Arguments,
          'name' | 'payloadAppName' | 'payloadAppDirectory' | 'nxCloud'
        >
      >('create-nx-workspace', 'create', {
        name: 'test-nx-payload-preset',
        payloadAppName: 'my-app',
        payloadAppDirectory: 'apps/app',
        nxCloud: 'skip'
      });

      addWorkspaceDirectory(workspaceDirectory);

      // npm ls will fail if the package is not installed properly
      await runCommandAsync('npm ls @cdwr/nx-payload', {
        cwd: workspaceDirectory
      });

      // Verify `appName` and `appDirectory` were used over `name`
      expect(
        JSON.parse(
          readFileSync(`${workspaceDirectory}/apps/app/project.json`, {
            encoding: 'utf-8'
          })
        ).name
      ).toBe('my-app');
    });
  });
});
