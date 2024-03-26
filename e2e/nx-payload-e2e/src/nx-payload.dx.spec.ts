import { runCommandAsync, runNxCommandAsync } from '@nx/plugin/testing';
import { agent } from 'supertest';

import {
  type CreateNxWorkspaceProject,
  ensureCreateNxWorkspaceProject
} from './utils/ensure-create-nx-workspace-project';

// TODO: Getting "ECONNREFUSED" during `npm install` in Dockerfile, using local Verdaccio registry
describe.skip('Test developer experience', () => {
  let project: CreateNxWorkspaceProject;

  console.log = jest.fn();
  jest.setTimeout(900_000);

  beforeAll(async () => {
    project = await ensureCreateNxWorkspaceProject(
      'test-dx',
      '@cdwr/nx-payload'
    );
  });

  it('should be able to start app and database', async () => {
    await runNxCommandAsync('start', {
      cwd: project.workspaceDirectory
    });

    expect((await agent('http://localhost:3000').get('/')).statusCode).toBe(
      200
    );

    await runCommandAsync('stop', {
      cwd: project.workspaceDirectory
    });

    expect((await agent('http://localhost:3000').get('/')).statusCode).not.toBe(
      200
    );
  });
});
