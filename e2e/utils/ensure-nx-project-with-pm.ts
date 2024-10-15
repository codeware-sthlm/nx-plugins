import { execSync } from 'child_process';
import { dirname } from 'path';

import { PackageManager, getPackageManagerCommand } from '@nx/devkit';
import {
  cleanup,
  patchPackageJsonForPlugin,
  tmpProjPath
} from '@nx/plugin/testing';
import { logDebug } from '@nx-plugins/core';
import { copySync, mkdirSync } from 'fs-extra';

import { getE2EPackageManager } from './get-e2e-package-manager';

function runNxNewCommand(args, silent) {
  const localTmpDir = dirname(tmpProjPath());
  return execSync(
    `node ${require.resolve('nx')} new proj --nx-workspace-root=${localTmpDir} --no-interactive --skip-install --collection=@nx/workspace --npmScope=proj --preset=apps ${args || ''}`,
    {
      cwd: localTmpDir,
      // eslint-disable-next-line no-constant-condition
      ...(silent && false ? { stdio: ['ignore', 'ignore', 'ignore'] } : {}),
      windowsHide: true
    }
  );
}

/**
 * Ensure the creation of a new E2E Nx workspace project, similar to `ensureNxProject`.
 *
 * This function lets you select which package manager to use within the test project.
 * When it's not provided `E2E_PACKAGE_MANAGER` is used in the first place,
 * with fallback to current workspace.
 *
 * @param npmPackageName Package name to test
 * @param pluginDistPath Local path to package dist folder
 * @param options
 * @returns The resolved package manager
 */
export function ensureNxProjectWithPm(
  npmPackageName: string,
  pluginDistPath: string,
  options?: {
    pluginDistPathToCopyFrom?: string;
    packageManager?: PackageManager;
    stacktrace?: boolean;
  }
): void {
  // Temporary e2e project path
  const cwd = tmpProjPath();

  const pm = options?.packageManager || getE2EPackageManager();
  const pmc = getPackageManagerCommand(pm, cwd);

  logDebug(`Resolved test package manager '${pm}'`);

  // Re-create temp project folder
  mkdirSync(cwd, { recursive: true });

  cleanup();
  runNxNewCommand(`--package-manager=${pm}`, true);

  patchPackageJsonForPlugin(npmPackageName, pluginDistPath);

  if (pmc.preInstall) {
    execSync(pmc.preInstall, {
      cwd,
      windowsHide: true,
      stdio: ['ignore', 'ignore', 'ignore']
    });
  }

  if (options?.pluginDistPathToCopyFrom) {
    copySync(options.pluginDistPathToCopyFrom, pluginDistPath);
  }

  execSync(pmc.install, {
    cwd,
    windowsHide: true,
    stdio: ['ignore', 'ignore', 'ignore']
  });
}
