import type { CreateNodesContext, TargetConfiguration } from '@nx/devkit';
import { getNamedInputs } from '@nx/devkit/src/utils/get-named-inputs';

import type { BuildExecutorSchema } from '../../executors/build/schema';

import type { NormalizedOptions } from './types';

export const createPayloadTargets = async (
  projectRoot: string,
  options: NormalizedOptions,
  context: CreateNodesContext
): Promise<Record<string, TargetConfiguration>> => {
  const namedInputs = getNamedInputs(projectRoot, context);

  const targets: Record<string, TargetConfiguration<BuildExecutorSchema>> = {};

  // Add `build` target
  targets[options.buildTargetName] = {
    executor: '@cdwr/nx-payload:build',
    inputs: [
      'default',
      Object.hasOwn(namedInputs, 'production') ? '^production' : '^default',
      { externalDependencies: ['express', 'payload'] }
    ],
    outputs: ['{options.outputPath}'],
    options: {
      main: '{projectRoot}/src/main.ts',
      tsConfig: '{projectRoot}/tsconfig.app.json',
      outputPath: '{workspaceRoot}/dist/{projectRoot}',
      assets: ['{projectRoot}/assets'],
      clean: true,
      updateBuildableProjectDepsInPackageJson: true,
      buildableProjectDepsInPackageJsonType: 'dependencies',
      transformers: [],
      watch: false
    },
    cache: true
  };

  // Add `payload` target
  targets[options.payloadTargetName] = {
    executor: '@cdwr/nx-payload:payload',
    cache: false
  };

  return targets;
};
