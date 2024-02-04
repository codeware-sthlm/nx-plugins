/**
 * This script starts a local registry for e2e testing purposes.
 * It is meant to be called in jest's globalSetup.
 */

import { exec } from 'child_process';
import { join } from 'path';

import { Config } from '@jest/types';
import { startLocalRegistry } from '@nx/js/plugins/jest/local-registry';
import { tmpdir } from 'tmp';

const LARGE_BUFFER = 1024 * 1000000;

export default async (globalConfig: Config.ConfigGlobals) => {
  const isVerbose: boolean =
    process.env.NX_VERBOSE_LOGGING === 'true' || !!globalConfig.verbose;

  const pathNumber = process.env.NX_E2E_PATCH_NUMBER || new Date().getTime();

  // local registry target to run
  const localRegistryTarget = 'workspace:local-registry';

  // storage folder for the local registry
  const storageLocation = join(
    tmpdir,
    'local-registry/storage',
    process.env.NX_TASK_TARGET_PROJECT ?? ''
  );

  global.stopLocalRegistry = await startLocalRegistry({
    localRegistryTarget,
    storage: storageLocation,
    verbose: isVerbose
  });

  console.log('Publishing packages to local registry');

  await new Promise<void>((resolve, reject) => {
    const publishProcess = exec(
      `yarn nx run-many -t publish --ver 0.0.${pathNumber}-e2e --tag e2e`,
      {
        env: process.env,
        maxBuffer: LARGE_BUFFER
      }
    );
    let logs = Buffer.from('');
    if (isVerbose) {
      publishProcess?.stdout?.pipe(process.stdout);
      publishProcess?.stderr?.pipe(process.stderr);
    } else {
      publishProcess?.stdout?.on('data', (data) => (logs += data));
      publishProcess?.stderr?.on('data', (data) => (logs += data));
    }
    publishProcess.on('exit', (code) => {
      if (code && code > 0) {
        if (!isVerbose) {
          console.log(logs.toString());
        }
        reject(code);
      }
      resolve();
    });
  });
};
