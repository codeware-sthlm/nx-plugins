import type { NormalizedOptions, PayloadPluginOptions } from './types';

export const normalizeOptions = (
  options?: PayloadPluginOptions
): NormalizedOptions => ({
  buildTargetName: options?.buildTargetName ?? 'build',
  mongodbTargetname: options?.mongodbTargetname ?? 'mongodb',
  payloadTargetName: options?.payloadTargetName ?? 'payload',
  postgresTargetName: options?.postgresTargetName ?? 'postgres',
  startTargetName: options?.startTargetName ?? 'start',
  stopTargetName: options?.stopTargetName ?? 'stop'
});
