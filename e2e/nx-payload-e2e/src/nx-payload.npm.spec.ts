import { runCommandAsync } from '@nx/plugin/testing';
import { agent } from 'supertest';

import {
  type CreateNxWorkspaceProject,
  ensureCreateNxWorkspaceProject
} from './utils/ensure-create-nx-workspace-project';

describe('Verify local npm and create empty workspace', () => {
  let project: CreateNxWorkspaceProject;

  console.log = jest.fn();
  jest.setTimeout(900_000);

  beforeAll(async () => {
    project = await ensureCreateNxWorkspaceProject('test-npm', 'apps');
  });

  it('should be connected to local registry', () => {
    return agent('http://localhost:4873').get('/').expect(200);
  });

  it('should have installed nx workspace', async () => {
    await runCommandAsync('npm ls @nx/workspace', {
      cwd: project.workspaceDirectory
    });
  });

  it('should not have installed nx-payload plugin', async () => {
    // npm ls will fail if the package is not installed properly
    // `> spawn /bin/sh ENOENT`
    const { stderr, stdout } = await runCommandAsync(
      'npm ls @cdwr/nx-payload',
      {
        cwd: project.workspaceDirectory,
        silenceError: true
      }
    );

    expect(`${stderr}${stdout}`).toContain('(empty)');
  });
});
