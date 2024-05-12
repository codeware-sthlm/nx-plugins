import type { NormalizedOptions, PayloadPluginOptions } from './types';

export const normalizeOptions = (
  options?: PayloadPluginOptions
): NormalizedOptions => ({
  buildTargetName: options?.buildTargetName ?? 'build',
  dockerBuildTargetName: options?.dockerBuildTargetName ?? 'docker:build',
  dockerRunTargetName: options?.dockerRunTargetName ?? 'docker:run',
  mongodbTargetName: options?.mongodbTargetName ?? 'mongodb',
  payloadTargetName: options?.payloadTargetName ?? 'payload',
  postgresTargetName: options?.postgresTargetName ?? 'postgres',
  startTargetName: options?.startTargetName ?? 'start',
  stopTargetName: options?.stopTargetName ?? 'stop'
});
