import { readJson, runCommandAsync, runNxCommand } from '@nx/plugin/testing';

import {
  type CreateNxWorkspaceProject,
  ensureCreateNxWorkspaceProject
} from './utils/ensure-create-nx-workspace-project';

describe('Create workspace with preset', () => {
  let project: CreateNxWorkspaceProject;

  jest.setTimeout(900_000);

  beforeAll(() => {
    project = ensureCreateNxWorkspaceProject('@cdwr/nx-payload');
  });

  afterAll(() => {
    runNxCommand('reset');
  });

  it('should have installed nx-payload plugin', async () => {
    await runCommandAsync('npm ls @cdwr/nx-payload');
  });

  it('should have created app project', () => {
    expect(project.appName.length).toBeGreaterThan(0);

    // Verify `appName` and `appDirectory` were used over `name`
    expect(readJson(`${project.appDirectory}/project.json`).name).toBe(
      project.appName
    );
  });
});
