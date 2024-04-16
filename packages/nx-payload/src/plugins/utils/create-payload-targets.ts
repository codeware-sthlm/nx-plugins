import type {
  CreateNodesContext,
  ProjectConfiguration,
  TargetConfiguration
} from '@nx/devkit';
import { getNamedInputs } from '@nx/devkit/src/utils/get-named-inputs';
import type { RunCommandsOptions } from 'nx/src/executors/run-commands/run-commands.impl';

import type { BuildExecutorSchema } from '../../executors/build/schema';

import type { NormalizedOptions } from './types';

export const createPayloadTargets = async (
  projectRoot: string,
  projectConfig: ProjectConfiguration,
  options: NormalizedOptions,
  context: CreateNodesContext
): Promise<Record<string, TargetConfiguration>> => {
  const namedInputs = getNamedInputs(projectRoot, context);

  const targets: Record<
    string,
    TargetConfiguration<BuildExecutorSchema | Partial<RunCommandsOptions>>
  > = {};

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

  // Add `mongodb` target
  targets[options.mongodbTargetname] = {
    executor: 'nx:run-commands',
    options: {
      command: `docker ps -q -f name=mongodb-${projectConfig.name} | grep . && echo '[Running] mongodb is already started' || docker run --name mongodb-${projectConfig.name} --rm -d -p 27017:27017 mongo`
    },
    cache: false
  };

  // Add `payload` target
  targets[options.payloadTargetName] = {
    executor: '@cdwr/nx-payload:payload',
    cache: false
  };

  // Add `postgres` target
  targets[options.postgresTargetName] = {
    executor: 'nx:run-commands',
    options: {
      command: `docker ps -q -f name=postgres-${projectConfig.name} | grep . && echo '[Running] PostgreSQL init process complete' || docker run --name postgres-${projectConfig.name} --rm --env-file ${projectRoot}/.env -p 5432:5432 postgres`,
      readyWhen: 'PostgreSQL init process complete'
    },
    cache: false
  };

  // Add `start` target
  targets[options.startTargetName] = {
    executor: 'nx:run-commands',
    options: {
      command: `docker compose -f ${projectRoot}/docker-compose.yml up -d`
    },
    cache: false
  };

  // Add `stop` target
  targets[options.stopTargetName] = {
    executor: 'nx:run-commands',
    options: {
      command: `docker compose -f ${projectRoot}/docker-compose.yml down`
    },
    cache: false
  };

  return targets;
};
