import { PackageManager } from '@nx/devkit';

/** Map package manager to lock file name */
export const packageManagerLockFiles: Record<PackageManager, string> = {
  npm: 'package-lock.json',
  pnpm: 'pnpm-lock.yaml',
  yarn: 'yarn.lock'
};
