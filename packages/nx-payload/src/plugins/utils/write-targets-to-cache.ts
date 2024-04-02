import { type TargetConfiguration, writeJsonFile } from '@nx/devkit';

export const writeTargetsToCache = (
  cachePath: string,
  targets: Record<string, Record<string, TargetConfiguration>>
) => writeJsonFile(cachePath, targets);
