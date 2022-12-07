import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

describe('Payload Applications', () => {
  // Setting up individual workspaces per
  // test can cause e2e runs to take a long time.
  // For this reason, we recommend each suite only
  // consumes 1 workspace. The tests should each operate
  // on a unique project in the workspace, such that they
  // are not dependant on one another.
  beforeAll(() => {
    ensureNxProject('@cws-tools/nx-payload', 'dist/packages/nx-payload');
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
  });

  it('should generate application', async () => {
    const appName = uniq('app');

    await runNxCommandAsync(
      `generate @cws-tools/nx-payload:application ${appName}`
    );

    const result = await runNxCommandAsync(`build ${appName}`);
    console.log('stdout:\n', result.stdout);
    console.log('stderr:\n', result.stderr);
    expect(result.stdout.includes('compiled successfully')).toBeTruthy();
    expect(() => checkFilesExist(`apps/${appName}/package.json`)).not.toThrow();
  }, 120000);

  it('should support --directory flag', async () => {
    const appName = uniq('app');
    const dirName = uniq('dir');

    await runNxCommandAsync(
      `generate @cws-tools/nx-payload:application ${appName} --directory ${dirName}`
    );

    expect(() =>
      checkFilesExist(`apps/${dirName}/${appName}/package.json`)
    ).not.toThrow();
  }, 120000);

  it('should support --tags flag', async () => {
    const appName = uniq('app');
    const tags = ['e2etag', 'e2ePackage'];

    await runNxCommandAsync(
      `generate @cws-tools/nx-payload:application ${appName} --tags ${tags.join(
        ','
      )}`
    );
    const project = readJson(`apps/${appName}/project.json`);
    expect(project.tags).toEqual(tags);
  }, 120000);

  it.todo('should test more flags');
});
