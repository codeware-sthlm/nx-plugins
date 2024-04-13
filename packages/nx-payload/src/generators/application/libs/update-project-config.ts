import {
  type ProjectConfiguration,
  type TargetConfiguration,
  type Tree,
  readNxJson,
  readProjectConfiguration,
  updateProjectConfiguration
} from '@nx/devkit';

import { isPluginInferenceEnabled } from './is-plugin-inference-enabled';
import type { NormalizedSchema } from './normalize-options';

/** Available targets */
type Target =
  | 'build'
  | 'lint'
  | 'mongodb'
  | 'payload'
  | 'postgres'
  | 'serve'
  | 'start'
  | 'stop'
  | 'test';

export function updateProjectConfig(host: Tree, options: NormalizedSchema) {
  const nxJson = readNxJson(host);
  const projectConfig = readProjectConfiguration(host, options.name);

  if (!projectConfig) {
    throw new Error('Could not read project.json');
  }
  const projectBuild = projectConfig.targets?.build;
  const projectLint = projectConfig.targets?.lint;
  const projectServe = projectConfig.targets?.serve;
  const projectTest = projectConfig.targets?.test;

  /** Define all targets configurations */
  const allTargetsConfigurations: Record<Target, TargetConfiguration> = {
    build: {
      executor: '@cdwr/nx-payload:build',
      options: {
        main: projectBuild?.options.main,
        tsConfig: projectBuild?.options.tsConfig,
        outputPath: projectBuild?.options.outputPath
      }
    },
    serve: {
      ...projectServe,
      options: {
        ...projectServe?.options,
        watch: true
      },
      configurations: {
        ...projectServe?.configurations,
        development: {
          buildTarget: `${options.name}:build:development`
        }
      }
    },
    lint: {
      ...projectLint
    },
    test: {
      ...projectTest
    },
    payload: {
      executor: '@cdwr/nx-payload:payload'
    },
    // TODO: Should be managed by an executor
    mongodb: {
      executor: 'nx:run-commands',
      options: {
        command: `docker ps -q -f name=mongodb-${options.name} | grep . && echo '[Running] mongodb is already started' || docker run --name mongodb-${options.name} --rm -d -p 27017:27017 mongo`
      }
    },
    // TODO: Should be managed by an executor
    postgres: {
      executor: 'nx:run-commands',
      options: {
        command: `docker ps -q -f name=postgres-${options.name} | grep . && echo '[Running] PostgreSQL init process complete' || docker run --name postgres-${options.name} --rm --env-file ${options.directory}/.env -p 5432:5432 postgres`,
        readyWhen: 'PostgreSQL init process complete'
      }
    },
    start: {
      command: `docker compose -f ${options.directory}/docker-compose.yml up -d`
    },
    stop: {
      command: `docker compose -f ${options.directory}/docker-compose.yml down`
    }
  };

  // Targets which can be inferred
  const inferredTargets: Array<Target> = ['build', 'payload'];

  // Targets which should be added to the project configuration
  // (if inference is enabled, the inferred targets will not be added to the project configuration)
  const projectTargets = Object.keys(allTargetsConfigurations)
    .filter((target) =>
      isPluginInferenceEnabled(nxJson)
        ? inferredTargets.map(String).includes(target) === false
        : true
    )
    .map((target) => target as Target);

  // Final target configurations
  const targetsConfigurations = projectTargets.reduce(
    (acc, key) => {
      acc[key] = allTargetsConfigurations[key];
      return acc;
    },
    {} as typeof allTargetsConfigurations
  );

  const project: ProjectConfiguration = {
    name: projectConfig.name,
    root: projectConfig.root,
    sourceRoot: projectConfig.sourceRoot,
    projectType: projectConfig.projectType,
    targets: targetsConfigurations,
    tags: projectConfig.tags
  };

  updateProjectConfiguration(host, options.name, {
    ...project
  });
}
