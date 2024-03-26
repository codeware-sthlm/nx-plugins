import { readFileSync } from 'fs';

import { runCommandAsync } from '@nx/plugin/testing';

import {
  type CreateNxWorkspaceProject,
  ensureCreateNxWorkspaceProject
} from './utils/ensure-create-nx-workspace-project';

describe('Create workspace with preset', () => {
  let project: CreateNxWorkspaceProject;

  console.log = jest.fn();
  jest.setTimeout(900_000);

  beforeAll(async () => {
    project = await ensureCreateNxWorkspaceProject(
      'test-preset',
      '@cdwr/nx-payload'
    );
  });

  it('should have installed nx-payload plugin', async () => {
    await runCommandAsync('npm ls @cdwr/nx-payload', {
      cwd: project.workspaceDirectory
    });
  });

  it('should have created app project', async () => {
    expect(project.appName.length).toBeGreaterThan(0);

    // Verify `appName` and `appDirectory` were used over `name`
    expect(
      JSON.parse(
        readFileSync(
          `${project.workspaceDirectory}/${project.appPath}/project.json`,
          {
            encoding: 'utf-8'
          }
        )
      ).name
    ).toBe(project.appName);
  });
});
