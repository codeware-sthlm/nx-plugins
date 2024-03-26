import { ExecutorContext } from '@nx/devkit';
import { ExecutorOptions } from '@nx/js/src/utils/schema';

import executor from './build';
import type { BuildExecutorSchema } from './schema';

describe.skip('Build Executor', () => {
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

  it('can run', async () => {
    const output = await executor(testOptions, context);
    expect(output.success).toBe(true);
  });
});
