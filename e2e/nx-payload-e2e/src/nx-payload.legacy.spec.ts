import type { ProjectConfiguration } from '@nx/devkit';
import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommand,
  uniq
} from '@nx/plugin/testing';

describe('@cdwr/nx-payload:app', () => {
  let originalEnv: string;

  jest.setTimeout(900_000);

  beforeAll(() => {
    // Disable plugin inference
    originalEnv = process.env.NX_ADD_PLUGINS;
    process.env.NX_ADD_PLUGINS = 'false';

    ensureNxProject('@cdwr/nx-payload', 'dist/packages/nx-payload');
  });

  afterAll(() => {
    process.env.NX_ADD_PLUGINS = originalEnv;
    runNxCommand('reset');
  });

  describe('required options', () => {
    const appName = uniq('app');

    beforeAll(() => {
      runNxCommand(
        `g @cdwr/nx-payload:app ${appName} --directory apps/${appName}`
      );
    });

    it('should generate application', () => {
      expect(() =>
        checkFilesExist(
          `apps/${appName}/project.json`,
          `apps/${appName}/src/main.ts`,
          `apps/${appName}-e2e/project.json`,
          `apps/${appName}-e2e/src/${appName}/${appName}.spec.ts`
        )
      ).not.toThrow();
    });

    it('should only have build, payload-build and payload-cli from inferred targets in project.json', () => {
      const projectJson = readJson<ProjectConfiguration>(
        `apps/${appName}/project.json`
      );

      ['build', 'payload-build', 'payload-cli'].forEach((target) => {
        expect(projectJson.targets[target]).toBeDefined();
      });
      [
        'docker-build',
        'docker-run',
        'mongodb',
        'postgres',
        'start',
        'stop'
      ].forEach((target) => {
        expect(projectJson.targets[target]).toBeUndefined();
      });
    });

    it('should build application', () => {
      const result = runNxCommand(`build ${appName}`);
      expect(result).toContain('Successfully ran target build');

      expect(() =>
        checkFilesExist(
          `dist/apps/${appName}/build/index.html`,
          `dist/apps/${appName}/package.json`,
          `dist/apps/${appName}/src/main.js`
        )
      ).not.toThrow();
    });

    it('should test application', () => {
      const result = runNxCommand(`test ${appName}`);
      expect(result).toContain('Successfully ran target test');
    });

    it('should lint application', () => {
      const result = runNxCommand(`lint ${appName}`);
      expect(result).toContain('Successfully ran target lint');
    });
  });

  describe('optional options', () => {
    it('should apply tags (--tags)', () => {
      const appName = uniq('app');
      runNxCommand(
        `g @cdwr/nx-payload:app ${appName} --directory apps/${appName} --tags e2etag,e2ePackage`
      );

      expect(readJson(`apps/${appName}/project.json`).tags).toEqual([
        'e2etag',
        'e2ePackage'
      ]);
    });

    it('should apply tags (alias -t)', () => {
      const appName = uniq('app');
      runNxCommand(
        `g @cdwr/nx-payload:app ${appName} --directory apps/${appName} -t aliasTag`
      );

      expect(readJson(`apps/${appName}/project.json`).tags).toEqual([
        'aliasTag'
      ]);
    });

    it('should skip e2e project', () => {
      const appName = uniq('app');
      runNxCommand(
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
