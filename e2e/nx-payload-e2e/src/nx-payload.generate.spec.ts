import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq
} from '@nx/plugin/testing';

describe('Generate payload application', () => {
  console.log = jest.fn();
  jest.setTimeout(900_000);

  beforeAll(() => {
    ensureNxProject('@cdwr/nx-payload', 'dist/packages/nx-payload');
  });

  describe('required options', () => {
    const appName = uniq('app');

    it('should generate default application', async () => {
      await runNxCommandAsync(
        `g @cdwr/nx-payload:app ${appName} --directory apps/${appName}`
      );

      expect(() =>
        checkFilesExist(
          `apps/${appName}/project.json`,
          `apps/${appName}/src/main.ts`,
          `apps/${appName}-e2e/project.json`,
          `apps/${appName}-e2e/src/${appName}/${appName}.spec.ts`
        )
      ).not.toThrow();
    });

    it('should be able to build', async () => {
      await runNxCommandAsync(`build ${appName}`);

      expect(() =>
        checkFilesExist(
          `dist/apps/${appName}/build/index.html`,
          `dist/apps/${appName}/package.json`,
          `dist/apps/${appName}/src/main.js`
        )
      ).not.toThrow();
    });

    it('should be able to test', async () => {
      expect(await runNxCommandAsync(`test ${appName}`)).toBeTruthy();
    });

    it('should be able to lint', async () => {
      expect(await runNxCommandAsync(`lint ${appName}`)).toBeTruthy();
    });
  });

  describe('optional options', () => {
    it('should apply tags (--tags)', async () => {
      const appName = uniq('app');
      await runNxCommandAsync(
        `g @cdwr/nx-payload:app ${appName} --directory apps/${appName} --tags e2etag,e2ePackage`
      );

      expect(readJson(`apps/${appName}/project.json`).tags).toEqual([
        'e2etag',
        'e2ePackage'
      ]);
    });

    it('should apply tags (alias -t)', async () => {
      const appName = uniq('app');
      await runNxCommandAsync(
        `g @cdwr/nx-payload:app ${appName} --directory apps/${appName} -t aliasTag`
      );

      expect(readJson(`apps/${appName}/project.json`).tags).toEqual([
        'aliasTag'
      ]);
    });

    it('should skip e2e project', async () => {
      const appName = uniq('app');
      await runNxCommandAsync(
        `g @cdwr/nx-payload:app ${appName} --directory apps/${appName} --skip-e2e`
      );

      expect(() =>
        checkFilesExist(`apps/${appName}-e2e/project.json`)
      ).toThrow();
    });
  });

  describe('launch application', () => {
    it.todo('should have a running mongo instance');
    it.todo('should open admin page and create a new user');
  });
});
