import {
  type ProjectConfiguration,
  type TargetConfiguration,
  type Tree,
  getPackageManagerCommand,
  joinPathFragments,
  readProjectConfiguration,
  updateProjectConfiguration
} from '@nx/devkit';

import { type NormalizedSchema } from './normalize-options';

type target =
  | 'build'
  | 'build-payload'
  | 'generate-graphql'
  | 'generate-types'
  | 'lint'
  | 'mongodb'
  | 'serve'
  | 'start'
  | 'stop'
  | 'test';

export function updateProjectConfig(host: Tree, options: NormalizedSchema) {
  const pmCommand = getPackageManagerCommand();
  const projectConfig = readProjectConfiguration(host, options.name);

  if (!projectConfig) {
    throw new Error('Could not read project.json');
  }
  const projectBuild = projectConfig.targets?.build;
  const projectLint = projectConfig.targets?.lint;
  const projectServe = projectConfig.targets?.serve;
  const projectTest = projectConfig.targets?.test;

  const targets: Record<target, TargetConfiguration> = {
    build: {
      ...projectBuild,
      executor: '@nx/js:tsc',
      options: {
        outputPath: joinPathFragments('dist', options.directory),
        main: joinPathFragments(options.directory, 'src', 'main.ts'),
        tsConfig: joinPathFragments(options.directory, 'tsconfig.app.json'),
        assets: [joinPathFragments(options.directory, 'src', 'assets')],
        updateBuildableProjectDepsInPackageJson: true,
        buildableProjectDepsInPackageJsonType: 'dependencies',
        clean: false
      },
      dependsOn: ['build-payload', 'generate-graphql', 'generate-types']
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
      },
      dependsOn: ['mongodb']
    },

    lint: {
      ...projectLint
    },

    test: {
      ...projectTest
    },

    'build-payload': {
      executor: 'nx:run-commands',
      defaultConfiguration: 'production',
      options: {
        commands: [
          `${pmCommand.exec} rimraf ${joinPathFragments(
            'dist',
            options.directory
          )}`,
          `${pmCommand.exec} payload build`
        ],
        env: {
          PAYLOAD_CONFIG_PATH: `${options.directory}/src/payload.config.ts`
        }
      },
      configurations: {
        production: {
          outputPath: joinPathFragments('dist', options.directory)
        }
      }
    },

    'generate-types': {
      executor: 'nx:run-commands',
      options: {
        command: `${pmCommand.exec} payload generate:types`,
        env: {
          PAYLOAD_CONFIG_PATH: `${options.directory}/src/payload.config.ts`
        }
      }
    },

    'generate-graphql': {
      executor: 'nx:run-commands',
      options: {
        command: `${pmCommand.exec} payload generate:graphQLSchema`,
        env: {
          PAYLOAD_CONFIG_PATH: `${options.directory}/src/payload.config.ts`
        }
      }
    },

    mongodb: {
      executor: 'nx:run-commands',
      options: {
        command: `docker run --name mongo-${options.name} --rm -d -p 27017:27017 mongo &1>2 | /dev/null || true`
      }
    },

    start: {
      command: `docker compose -f ${options.directory}/docker-compose.yml up -d`
    },

    stop: {
      command: `docker compose -f ${options.directory}/docker-compose.yml down`
    }
  };

  const project: ProjectConfiguration = {
    name: projectConfig.name,
    root: projectConfig.root,
    sourceRoot: projectConfig.sourceRoot,
    projectType: projectConfig.projectType,
    targets,
    tags: projectConfig.tags
  };

  updateProjectConfiguration(host, options.name, {
    ...project
  });
}
