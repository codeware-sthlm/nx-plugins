import { mkdirSync, rmSync } from 'fs';
import { join } from 'path';

import { readJsonFile } from '@nx/devkit';
import { exists, runCommandAsync, tmpProjPath, uniq } from '@nx/plugin/testing';

export type CreateNxWorkspaceProject = {
  /** App name when generated */
  appName?: string;
  /** App path relative to workspace root when generated */
  appPath?: string;
  /** Project absolute directory */
  projectDirectory: string;
  /** Workspace absolute directory */
  workspaceDirectory: string;
  /** Workspace path relative to project root */
  workspacePath: string;
};

/**
 * Ensure the creation of a new Nx workspace project.
 *
 * It's an alternative to `ensureNxProject` which uses plugin build from local `dist`folder.
 * This function uses the local registry instead and setup the workspace in a more real world scenario.
 *
 * @param workspaceName Name of Nx workspace to create
 * @param preset Which preset to use as option to `create-nx-workspace`
 * @returns Project workspace details
 */
export async function ensureCreateNxWorkspaceProject(
  workspaceName: string,
  preset: 'apps' | '@cdwr/nx-payload'
): Promise<CreateNxWorkspaceProject> {
  const projectDirectory = tmpProjPath();
  const workspaceDirectory = join(projectDirectory, workspaceName);

  let appName: string;
  let appPath: string;

  // Get the local version of `create-nx-workspace`
  let version = 'latest';
  const { dependencies } = readJsonFile<{
    dependencies: Record<string, string>;
  }>(join(process.cwd(), 'package.json'));
  if ('create-nx-workspace' in dependencies) {
    version = dependencies['create-nx-workspace'];
  }

  // Ensure the workspace inside project directory is removed
  rmSync(workspaceDirectory, {
    recursive: true,
    force: true
  });

  // Ensure the project directory exists since we're not using `ensureNxProject`
  if (!exists(projectDirectory)) {
    mkdirSync(projectDirectory, {
      recursive: true
    });
  }

  // Prepare the options for `create-nx-workspace`
  const options = ['--nxCloud', 'skip', '--no-interactive'];

  // Add required options for `@cdwr/nx-payload` preset
  if (preset === '@cdwr/nx-payload') {
    appName = uniq('app');
    appPath = `apps/${appName}`;
    options.unshift(
      '--payloadAppName',
      appName,
      '--payloadAppDirectory',
      appPath
    );
  }
  const cliOptions = options.join(' ');

  await runCommandAsync(
    `npx create-nx-workspace@${version} ${workspaceName} --preset ${preset} ${cliOptions}`,
    {
      cwd: projectDirectory
    }
  );

  if (!exists(workspaceDirectory)) {
    throw new Error(`Failed to create test project in "${workspaceDirectory}"`);
  }

  return {
    appName,
    appPath,
    projectDirectory,
    workspaceDirectory,
    workspacePath: workspaceName
  };
}
