import { existsSync } from 'fs';
import { join } from 'path/posix';

import { type TargetConfiguration, readJsonFile } from '@nx/devkit';
import { projectGraphCacheDirectory } from 'nx/src/utils/cache-directory';

const readTargetsCache = (
  cachePath: string
): Record<string, Record<string, TargetConfiguration>> =>
  readJsonFile(cachePath);

export const cachePath = join(projectGraphCacheDirectory, 'payload.hash');

export const targetsCache = existsSync(cachePath)
  ? readTargetsCache(cachePath)
  : {};
