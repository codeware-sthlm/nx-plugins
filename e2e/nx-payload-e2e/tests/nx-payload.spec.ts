import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

describe('Payload Applications', () => {
  let appName: string;

  beforeAll(() => {
    ensureNxProject('@nx-plugins/nx-payload', 'dist/packages/nx-payload');
  });

  beforeEach(() => {
    appName = uniq('app');
  });

  afterAll(() => {
    runNxCommandAsync('reset');
  });

  describe('generate application', () => {
    it('should have a project file', async () => {
      await runNxCommandAsync(
        `generate @nx-plugins/nx-payload:application ${appName}`
      );
      expect(() =>
        checkFilesExist(`apps/${appName}/project.json`)
      ).not.toThrow();
    }, 300000);

    it('should build application', async () => {
      await runNxCommandAsync(
        `generate @nx-plugins/nx-payload:application ${appName}`
      );

      expect((await runNxCommandAsync(`build ${appName}`)).stdout).toContain(
        'Successfully ran target build'
      );
      expect(() =>
        checkFilesExist(
          `apps/${appName}/project.json`,
          `build/index.html`,
          `dist/apps/${appName}/package.json`,
          `dist/apps/${appName}/src/main.js`
        )
      ).not.toThrow();
    }, 300000);

    it('should test application', async () => {
      await runNxCommandAsync(
        `generate @nx-plugins/nx-payload:application ${appName}`
      );

      expect((await runNxCommandAsync(`test ${appName}`)).stdout).toContain(
        'Successfully ran target test'
      );
    }, 300000);

    it('should lint application', async () => {
      await runNxCommandAsync(
        `generate @nx-plugins/nx-payload:application ${appName}`
      );

      expect((await runNxCommandAsync(`lint ${appName}`)).stdout).toContain(
        'Successfully ran target lint'
      );
    }, 300000);
  });

  describe('--directory flag', () => {
    it('should generate application in custom directory', async () => {
      const dirName = uniq('dir');

      await runNxCommandAsync(
        `generate @nx-plugins/nx-payload:application ${appName} --directory=${dirName}`
      );

      expect(() =>
        checkFilesExist(`apps/${dirName}/${appName}/project.json`)
      ).not.toThrow();
    }, 300000);
  });

  describe('--tags flag', () => {
    it('should generate application with tags', async () => {
      await runNxCommandAsync(
        `generate @nx-plugins/nx-payload:application ${appName} --tags=e2etag,e2ePackage`
      );

      expect(readJson(`apps/${appName}/project.json`).tags).toEqual([
        'e2etag',
        'e2ePackage',
      ]);
    }, 300000);
  });

  describe('launch application', () => {
    it.todo('should have a running mongo instance');
    it.todo('should open admin page and create a new user');
  });
});
