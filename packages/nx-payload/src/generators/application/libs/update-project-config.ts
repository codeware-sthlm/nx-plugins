import {
  type ProjectConfiguration,
  type Tree,
  getPackageManagerCommand,
  joinPathFragments,
  readProjectConfiguration,
  updateProjectConfiguration
} from '@nx/devkit';

import { type NormalizedSchema } from './normalize-options';

export function updateProjectConfig(host: Tree, options: NormalizedSchema) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const targets: Record<string, any> = {};

  const pmCommand = getPackageManagerCommand();
  const projectConfig = readProjectConfiguration(host, options.name);

  if (!projectConfig) {
    throw new Error('Could not read project.json');
  }
  const projectBuild = projectConfig.targets?.build;
  const projectLint = projectConfig.targets?.lint;
  const projectServe = projectConfig.targets?.serve;
  const projectTest = projectConfig.targets?.test;

  targets.build = {
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
  };

  targets.serve = {
    ...projectServe,
    configurations: {
      ...projectServe?.configurations,
      development: {
        tsConfig: joinPathFragments(options.directory, 'tsconfig.dev.json')
      }
    }
  };

  targets.lint = {
    ...projectLint
  };

  targets.test = {
    ...projectTest
  };

  targets['build-payload'] = {
    executor: 'nx:run-commands',
    defaultConfiguration: 'production',
    options: {
      commands: [
        `${pmCommand.exec} rimraf ${joinPathFragments(
          'dist',
          options.directory
        )}`,
        `${pmCommand.exec} payload build`
      ]
    },
    configurations: {
      production: {
        outputPath: joinPathFragments('dist', options.directory)
      }
    }
  };

  targets['generate-types'] = {
    executor: 'nx:run-commands',
    options: {
      command: `${pmCommand.exec} payload generate:types`
    }
  };

  targets['generate-graphql'] = {
    executor: 'nx:run-commands',
    options: {
      command: `${pmCommand.exec} payload generate:graphQLSchema`
    }
  };

  targets['dx:launch'] = {
    command: `docker compose -f ${options.directory}/docker-compose.yml up -d`
  };

  targets['dx:down'] = {
    command: `docker compose -f ${options.directory}/docker-compose.yml down`
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
