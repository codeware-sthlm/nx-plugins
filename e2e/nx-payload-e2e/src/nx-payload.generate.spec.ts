import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  uniq
} from '@nx/plugin/testing';

import { runNxCommandAsync } from './utils/run-nx-command-async';

describe('Generate Payload application', () => {
  let appName: string;

  /** Application generate command without arguments */
  const baseCmd = 'generate @nx-plugins/nx-payload:app';

  console.log = jest.fn();
  jest.setTimeout(900_000);

  beforeAll(() => {
    ensureNxProject('@nx-plugins/nx-payload', 'dist/packages/nx-payload');
  });

  afterAll(async () => {
    await runNxCommandAsync('reset');
  });

  describe('required options', () => {
    it('should generate default application', async () => {
      appName = uniq('app');
      await runNxCommandAsync(
        `${baseCmd} ${appName} --directory apps/${appName}`
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
      appName = uniq('app');
      await runNxCommandAsync(
        `${baseCmd} ${appName} --directory apps/${appName} --tags e2etag,e2ePackage`
      );

      expect(readJson(`apps/${appName}/project.json`).tags).toEqual([
        'e2etag',
        'e2ePackage'
      ]);
    });

    it('should apply tags (alias -t)', async () => {
      appName = uniq('app');
      await runNxCommandAsync(
        `${baseCmd} ${appName} --directory apps/${appName} -t aliasTag`
      );

      expect(readJson(`apps/${appName}/project.json`).tags).toEqual([
        'aliasTag'
      ]);
    });

    it('should skip e2e project', async () => {
      appName = uniq('app');
      await runNxCommandAsync(
        `${baseCmd} ${appName} --directory apps/${appName} --skip-e2e`
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
