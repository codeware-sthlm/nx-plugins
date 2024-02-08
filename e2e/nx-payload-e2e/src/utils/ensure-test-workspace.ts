import { existsSync, mkdirSync, readdirSync, rmSync } from 'fs';
import { join } from 'path';

import { directoryExists } from '@nx/plugin/testing';

import { runCommandAsync } from './run-command-async';

/**
 * Ensure a test workspace gets created using either:
 *
 * - `create-nx-workspace` with preset `@cdwr/nx-payload`
 * - `create-nx-payload` with registry tag `e2e`.
 *
 * Require `{path}/start-local-registry.ts` to have been executed in Jest `globalSetup`.
 *
 * @param createWith Whether to create test workspace with Nx or Plugin
 * @param e2eKey Preserve workspace for tests using the same preset options
 * @param options Preset options only needed when creating a new test workspace
 *
 * @returns The directory where the test workspace was created or reused
 */
export async function ensureTestWorkspace<TOptions extends { name: string }>(
  createWith: 'create-nx-payload' | 'create-nx-workspace',
  e2eKey: string,
  options?: TOptions
) {
  const tempDir = join(process.cwd(), 'tmp', `e2e.${e2eKey}`);

  // Check whether test workspace should be reused
  if (existsSync(tempDir)) {
    const workspaceName = readdirSync(tempDir, {
      encoding: 'utf-8',
      withFileTypes: true
    })
      .filter((d) => d.isDirectory)
      .map((d) => d.name)
      .at(0);

    if (workspaceName) {
      const workspaceDir = join(tempDir, workspaceName);
      console.log(`Reuse existing test workspace "${workspaceDir}"`);
      return workspaceDir;
    }
  }

  if (!options) {
    throw '`options` is required';
  }

  const workspaceName = options['name'];
  const workspaceDir = join(tempDir, workspaceName);

  // Ensure temporary dir is created and empty
  rmSync(workspaceDir, {
    recursive: true,
    force: true
  });
  mkdirSync(tempDir, { recursive: true });

  const commandOptions = Object.keys(options)
    .filter((key) => key !== 'name')
    .filter((key) => options[key] !== undefined)
    .map((key) => `--${key}=${options[key]}`)
    .join(' ');

  const creator = `${
    createWith === 'create-nx-workspace' ? createWith : `${createWith}@e2e`
  }`;
  const preset =
    createWith === 'create-nx-workspace' ? `--preset @cdwr/nx-payload@e2e` : '';

  const command = `npx --yes ${creator} ${workspaceName} ${preset} ${commandOptions}`;

  console.log(`Test command: "${command}"`);

  await runCommandAsync(command, {
    cwd: tempDir,
    env: process.env
  });

  if (!directoryExists(workspaceDir)) {
    throw new Error(`Failed to create test workspace "${workspaceDir}"`);
  }

  console.log(`Created test workspace in "${workspaceDir}"`);

  return workspaceDir;
}
