import { execSync } from 'child_process';
import { mkdirSync, rmSync } from 'fs';
import { dirname, join } from 'path';

describe('npm install payload plugin', () => {
  let projectDirectory: string;

  console.log = jest.fn();

  beforeAll(() => {
    projectDirectory = createTestProject('nx-payload-npm');

    // The plugin has been built and published to a local registry in the jest globalSetup
    // Install the plugin built with the latest source code into the test repo
    execSync(`npm install @cdwr/nx-payload@e2e`, {
      cwd: projectDirectory,
      stdio: 'inherit',
      env: process.env
    });
  });

  afterAll(() => {
    // Cleanup the test project
    rmSync(projectDirectory, {
      recursive: true,
      force: true
    });
  });

  it('should be installed', () => {
    // npm ls will fail if the package is not installed properly
    execSync('npm ls @cdwr/nx-payload', {
      cwd: projectDirectory,
      stdio: 'inherit'
    });
  });
});

/**
 * Creates a test project with create-nx-workspace and installs the plugin
 * @returns The directory where the test project was created
 */
function createTestProject(name: string) {
  const projectName = name;
  const projectDirectory = join(process.cwd(), 'tmp', projectName);

  // Ensure projectDirectory is empty
  rmSync(projectDirectory, {
    recursive: true,
    force: true
  });
  mkdirSync(dirname(projectDirectory), {
    recursive: true
  });

  execSync(
    `npx --yes create-nx-workspace@latest ${projectName} --preset apps --no-nxCloud --no-interactive`,
    {
      cwd: dirname(projectDirectory),
      stdio: 'inherit',
      env: process.env
    }
  );
  console.log(`Created test project in "${projectDirectory}"`);

  return projectDirectory;
}
