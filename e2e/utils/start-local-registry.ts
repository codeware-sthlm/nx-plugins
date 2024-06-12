/**
 * This script starts a local registry for testing purposes.
 *
 * For e2e it is meant to be called in jest's `globalSetup`.
 */

import { startLocalRegistry } from '@nx/js/plugins/jest/local-registry';
import { releasePublish, releaseVersion } from 'nx/release';

export default async () => {
  const verbose = process.env['NX_VERBOSE_LOGGING'] === 'true';

  // local registry target to run
  const localRegistryTarget = 'workspace:local-registry';

  // storage folder for the local registry
  const storage = './tmp/local-registry/storage';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).stopLocalRegistry = await startLocalRegistry({
    localRegistryTarget,
    storage,
    verbose
  });

  await releaseVersion({
    stageChanges: false,
    gitCommit: false,
    gitTag: false,
    firstRelease: true,
    generatorOptionsOverrides: {
      skipLockFileUpdate: true
    },
    verbose
  });

  await releasePublish({
    tag: 'e2e',
    firstRelease: true,
    verbose
  });
};
