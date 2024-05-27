import type { NormalizedOptions, PayloadPluginOptions } from './types';

export const normalizeOptions = (
  options?: PayloadPluginOptions
): NormalizedOptions => ({
  buildTargetName: options?.buildTargetName ?? 'build',
  dockerBuildTargetName: options?.dockerBuildTargetName ?? 'docker-build',
  dockerRunTargetName: options?.dockerRunTargetName ?? 'docker-run',
  mongodbTargetName: options?.mongodbTargetName ?? 'mongodb',
  payloadBuildTargetName: options?.payloadBuildTargetName ?? 'payload-build',
  payloadCliTargetName: options?.payloadCliTargetName ?? 'payload-cli',
  postgresTargetName: options?.postgresTargetName ?? 'postgres',
  startTargetName: options?.startTargetName ?? 'start',
  stopTargetName: options?.stopTargetName ?? 'stop'
});
