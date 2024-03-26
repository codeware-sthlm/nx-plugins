import type { ExecutorContext } from '@nx/devkit';

import {
  type NormalizedSchema,
  normalizeOptions
} from './libs/normalize-options';
import type { BuildExecutorSchema } from './schema';

describe('Build Executor', () => {
  let context: ExecutorContext;
  let testOptions: BuildExecutorSchema;

  beforeEach(async () => {
    context = {
      root: '/root',
      cwd: '/root',
      projectsConfigurations: {
        version: 2,
        projects: {
          testapp: { root: 'apps/testapp', sourceRoot: 'apps/testapp/src' }
        }
      },
      nxJsonConfiguration: {},
      isVerbose: false,
      projectName: 'testapp',
      targetName: 'build'
    };

    testOptions = {
      main: 'apps/testapp/src/index.ts',
      outputPath: 'dist/apps/testapp',
      tsConfig: 'apps/testapp/tsconfig.app.json',
      assets: [],
      updateBuildableProjectDepsInPackageJson: true,
      buildableProjectDepsInPackageJsonType: 'dependencies',
      transformers: [],
      watch: false,
      clean: true
    };
  });

  it('should normalize options for valid config', () => {
    const options = normalizeOptions(testOptions, context);

    expect(options).toEqual<NormalizedSchema>({
      projectRoot: 'apps/testapp',
      sourceRoot: 'apps/testapp/src',
      outputPath: 'dist/apps/testapp',
      main: 'apps/testapp/src/index.ts',
      tsConfig: 'apps/testapp/tsconfig.app.json',
      assets: [],
      updateBuildableProjectDepsInPackageJson: true,
      buildableProjectDepsInPackageJsonType: 'dependencies',
      transformers: [],
      watch: false,
      clean: true
    });
  });

  it('should set assets to assets folder when undefined or missing', () => {
    testOptions.assets = undefined;
    expect(normalizeOptions(testOptions, context)).toMatchObject({
      assets: ['apps/testapp/src/assets']
    });

    delete testOptions.assets;
    expect(normalizeOptions(testOptions, context)).toMatchObject({
      assets: ['apps/testapp/src/assets']
    });
  });

  it('should keep assets for empty array', () => {
    testOptions.assets = [];
    expect(normalizeOptions(testOptions, context)).toMatchObject({
      assets: []
    });
  });

  it('should default clean to true', () => {
    testOptions.clean = false;
    expect(normalizeOptions(testOptions, context)).toMatchObject({
      clean: false
    });

    delete testOptions.clean;
    expect(normalizeOptions(testOptions, context)).toMatchObject({
      clean: true
    });
  });

  it('should throw when projectName is missing', (done) => {
    delete context.projectName;
    try {
      normalizeOptions(testOptions, context);
    } catch (error) {
      done();
    }
  });

  it('should throw when project configuration is missing', (done) => {
    delete context.projectsConfigurations?.projects.testapp;
    try {
      normalizeOptions(testOptions, context);
    } catch (error) {
      done();
    }
  });

  it('should throw when project root is missing', (done) => {
    delete context.projectsConfigurations?.projects.testapp.root;
    try {
      normalizeOptions(testOptions, context);
    } catch (error) {
      done();
    }
  });

  it('should throw when sourceRoot is missing', (done) => {
    delete context.projectsConfigurations?.projects.testapp.sourceRoot;
    try {
      normalizeOptions(testOptions, context);
    } catch (error) {
      done();
    }
  });
});
