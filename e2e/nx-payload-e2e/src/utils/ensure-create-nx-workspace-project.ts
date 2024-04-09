import { mkdirSync } from 'fs';
import { basename, join } from 'path';

import { detectPackageManager, readJsonFile } from '@nx/devkit';
import {
  cleanup,
  directoryExists,
  exists,
  runCommand,
  tmpProjPath,
  uniq
} from '@nx/plugin/testing';

export type CreateNxWorkspaceProject = {
  /** Generated application name */
  appName?: string;
  /** Application directory  */
  appDirectory?: string;
  /** Project path where the workspace was generated */
  projectPath: string;
};

/** Package mananger options for `E2E_PACKAGE_MANAGER` */
const PackageManagersEnv = ['npm', 'pnpm', 'yarn', 'infer'] as const;
type PackageManagerEnv = (typeof PackageManagersEnv)[number];

/**
 * Ensure the creation of a new E2E Nx workspace project, using `create-nx-workspace`.
 *
 * It's an alternative to `ensureNxProject` which uses the plugin build from local `dist` folder.
 * This function uses the local registry instead to setup the workspace in a more real world scenario.
 *
 * Package mananger can be set via environment variable `E2E_PACKAGE_MANAGER`,
 * where the value can be `npm`, `pnpm`, `yarn`, or `infer` (current workspace).
 *
 * @param preset Which preset to use as option to `create-nx-workspace`
 * @returns Project workspace details
 */
export function ensureCreateNxWorkspaceProject(
  preset: 'apps' | '@cdwr/nx-payload'
): CreateNxWorkspaceProject {
  // Get the local version of `create-nx-workspace`
  let version = 'latest';
  const { dependencies } = readJsonFile<{
    dependencies: Record<string, string>;
  }>(join(process.cwd(), 'package.json'));
  if ('create-nx-workspace' in dependencies) {
    version = dependencies['create-nx-workspace'];
  }

  // Ensure the e2e temp path is removed
  cleanup();

  // Prepare the options for `create-nx-workspace`
  const options = ['--nxCloud', 'skip', '--no-interactive'];

  // Select package manager from environment where `infer` use the current package manager
  const packageManager = process.env.E2E_PACKAGE_MANAGER as
    | PackageManagerEnv
    | '';
  if (packageManager in PackageManagersEnv) {
    const pm =
      packageManager === 'infer' ? detectPackageManager() : packageManager;
    options.push('--packageManager', pm);
  }

  let appName: string;
  let appDirectory: string;

  // Add required options for `@cdwr/nx-payload` preset
  if (preset === '@cdwr/nx-payload') {
    appName = uniq('app');
    appDirectory = `apps/${appName}`;
    options.unshift(
      '--payloadAppName',
      appName,
      '--payloadAppDirectory',
      appDirectory
    );
  }
  const cliOptions = options.join(' ');

  // The workspace should created in the e2e temp path
  const projectPath = tmpProjPath();
  const name = basename(projectPath);
  const runPath = join(projectPath, '..');

  // Ensure run path exists
  if (!directoryExists(runPath)) {
    mkdirSync(runPath, { recursive: true });
  }

  const result = runCommand(
    `npx create-nx-workspace@${version} ${name} --preset ${preset} ${cliOptions}`,
    {
      cwd: runPath
    }
  );

  if (!exists(projectPath)) {
    console.log('runPath', runPath);
    console.log(result);
    throw new Error(`Failed to create test project in "${projectPath}"`);
  }

  return {
    appName,
    appDirectory,
    projectPath
  };
}
