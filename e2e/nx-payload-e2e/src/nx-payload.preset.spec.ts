import { execSync } from 'child_process';
import { readFileSync, rmSync } from 'fs';

import { type Arguments } from '@nx-plugins/create-nx-payload';
import { ensureTestWorkspace } from '@nx-plugins/e2e/utils';
import { agent } from 'supertest';

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
    it('should be created and installed', () => {
      const workspaceDirectory = ensureTestWorkspace<
        Pick<
          Arguments,
          'name' | 'payloadAppName' | 'payloadAppDirectory' | 'nxCloud'
        >
      >('create-nx-workspace', 'create', {
        name: 'test-nx-payload-preset',
        payloadAppName: 'my-app',
        payloadAppDirectory: 'apps/app',
        nxCloud: false
      });
      addWorkspaceDirectory(workspaceDirectory);

      // npm ls will fail if the package is not installed properly
      execSync('npm ls @cdwr/nx-payload', {
        cwd: workspaceDirectory,
        stdio: 'inherit'
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
