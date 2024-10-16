import { existsSync, mkdirSync, readFileSync } from 'fs';
import { basename, join } from 'path';

import { readJsonFile } from '@nx/devkit';
import {
  cleanup,
  directoryExists,
  exists,
  runCommand,
  runNxCommand,
  tmpProjPath,
  uniq
} from '@nx/plugin/testing';
import { logDebug, logError, logInfo } from '@nx-plugins/core';

import { getE2EPackageManager } from './get-e2e-package-manager';

export type CreateNxWorkspaceProject = {
  /** Generated application name */
  appName?: string;
  /** Application directory  */
  appDirectory?: string;
  /** Project path where the workspace was generated */
  projectPath: string;
};

/**
 * Ensure the creation of a new E2E Nx workspace project, using `create-nx-workspace`.
 *
 * It's an alternative to `ensureNxProject` which uses the plugin build from local `dist` folder.
 * This function uses the local registry instead to setup the workspace in a more real world scenario.
 *
 * Package mananger can be set via environment variable `CDWR_E2E_PACKAGE_MANAGER`.
 *
 * @param preset Which preset to use as option to `create-nx-workspace`
 * @returns Project workspace details
 */
export function ensureCreateNxWorkspaceProject({
  preset,
  ensurePluginIsInstalled
}: {
  preset: 'apps' | '@cdwr/nx-payload';
  ensurePluginIsInstalled?: boolean;
}): CreateNxWorkspaceProject {
  // Get the local version of `create-nx-workspace`
  let version = 'latest';
  const { dependencies } = readJsonFile<{
    dependencies: Record<string, string>;
  }>(join(process.cwd(), 'package.json'));
  if ('create-nx-workspace' in dependencies) {
    version = dependencies['create-nx-workspace'];
  }

  // Ensure the e2e temp path is removed
  try {
    cleanup();
  } catch (error) {
    logError('Failed to cleanup e2e temp path', (error as Error).message);
  }

  const pm = getE2EPackageManager();
  logInfo('Resolved test package manager', pm);

  // Prepare the options for `create-nx-workspace`
  const options = [
    '--nxCloud',
    'skip',
    '--no-interactive',
    '--packageManager',
    pm
  ];

  let appName = '';
  let appDirectory = '';

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

  const cmd = `npx create-nx-workspace@${version} ${name} --preset ${preset} ${cliOptions}`;

  logInfo('Creating Nx workspace project', `Preset '${preset}'`);
  logDebug('Run command', cmd);

  const result = runCommand(cmd, {
    cwd: runPath
  });

  if (!exists(projectPath)) {
    logDebug('Run path', runPath);
    logError('Command output', result);

    // Try to find and print error log content
    const logMatch = result.match(/Log file: (?<errorLog>.*error\.log)/);
    if (logMatch?.groups) {
      const errorLog = logMatch.groups['errorLog'];
      if (existsSync(errorLog)) {
        logInfo(
          `Output from ${errorLog}\n`,
          readFileSync(errorLog, { encoding: 'utf-8' })
        );
      } else {
        logInfo('Error log file could not be found', errorLog);
      }
    }

    // Debug output
    const packageFile = `${runPath}/${name}/package.json`;
    logDebug(packageFile, readFileSync(packageFile, { encoding: 'utf-8' }));
    const lockFile = `${runPath}/${name}/${pm === 'npm' ? 'package-lock.json' : pm === 'pnpm' ? 'pnpm-lock.yaml' : 'yarn.lock'}`;
    logDebug(lockFile, readFileSync(lockFile, { encoding: 'utf-8' }));
    if (pm === 'yarn') {
      logDebug(
        'yarn explain peer-requirements',
        runCommand('yarn explain peer-requirements', {
          cwd: `${runPath}/${name}`
        })
      );
    }

    throw new Error(`Failed to create test project in "${projectPath}"`);
  }

  if (preset === 'apps' && ensurePluginIsInstalled) {
    logDebug('Install plugin in empty apps workspace');
    runNxCommand('add @cdwr/nx-payload');
  }

  return {
    appName,
    appDirectory,
    projectPath
  };
}
