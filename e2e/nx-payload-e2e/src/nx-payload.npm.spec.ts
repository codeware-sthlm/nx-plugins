import { mkdirSync, rmSync } from 'fs';
import { dirname, join } from 'path';

import { readJsonFile } from '@nx/devkit';

import { runCommandAsync } from './utils/run-command-async';

describe('npm install payload plugin', () => {
  let projectDirectory: string;

  console.log = jest.fn();
  jest.setTimeout(900_000);

  beforeAll(async () => {
    projectDirectory = await createTestProject('nx-payload-npm');

    // The plugin has been built and published to a local registry in the jest globalSetup
    // Install the plugin built with the latest source code into the test repo
    await runCommandAsync(`npm install @cdwr/nx-payload@e2e`, {
      cwd: projectDirectory,
      env: process.env
    });
  });

  afterAll(() => {
    // Cleanup the test project
    if (projectDirectory) {
      rmSync(projectDirectory, {
        recursive: true,
        force: true
      });
    }
  });

  it('should be installed', async () => {
    // npm ls will fail if the package is not installed properly
    await runCommandAsync('npm ls @cdwr/nx-payload', {
      cwd: projectDirectory
    });
  });
});

/**
 * Creates a test project with create-nx-workspace and installs the plugin
 * @returns The directory where the test project was created
 */
async function createTestProject(name: string) {
  const projectName = name;
  const projectDirectory = join(process.cwd(), 'tmp', projectName);

  // Get local version of `create-nx-workspace`
  let version = 'latest';
  const { dependencies } = readJsonFile<{
    dependencies: Record<string, string>;
  }>(join(process.cwd(), 'package.json'));
  if ('create-nx-workspace' in dependencies) {
    version = dependencies['create-nx-workspace'];
  }

  // Ensure projectDirectory is empty
  rmSync(projectDirectory, {
    recursive: true,
    force: true
  });
  mkdirSync(dirname(projectDirectory), {
    recursive: true
  });

  await runCommandAsync(
    `npx --yes create-nx-workspace@${version} ${projectName} --preset apps --nxCloud skip --no-interactive`,
    {
      cwd: dirname(projectDirectory),
      env: process.env
    }
  );
  console.log(`Created test project in "${projectDirectory}"`);

  return projectDirectory;
}
