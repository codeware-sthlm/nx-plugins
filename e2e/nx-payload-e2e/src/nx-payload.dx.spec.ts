import { runNxCommand } from '@nx/plugin/testing';
import { agent } from 'supertest';

import { ensureCreateNxWorkspaceProject } from './utils/ensure-create-nx-workspace-project';

// TODO: Getting "ECONNREFUSED" during `npm install` in Dockerfile, using local Verdaccio registry
describe.skip('Test developer experience', () => {
  jest.setTimeout(900_000);

  beforeAll(() => {
    ensureCreateNxWorkspaceProject('@cdwr/nx-payload');
  });

  afterAll(() => {
    runNxCommand('reset');
  });

  it('should be able to start app and database', async () => {
    runNxCommand('start');
    expect((await agent('http://localhost:3000').get('/')).statusCode).toBe(
      200
    );

    runNxCommand('stop');
    expect((await agent('http://localhost:3000').get('/')).statusCode).not.toBe(
      200
    );
  });
});
