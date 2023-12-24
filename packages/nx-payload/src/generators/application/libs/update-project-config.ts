import {
  type ProjectConfiguration,
  type Tree,
  joinPathFragments,
  readProjectConfiguration,
  updateProjectConfiguration,
} from '@nx/devkit';

import type { NormalizedSchema } from './normalize-options';

export function updateProjectConfig(host: Tree, options: NormalizedSchema) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const targets: Record<string, any> = {};

  const projectConfig = readProjectConfiguration(host, options.name);

  const projectBuild = projectConfig.targets.build;
  const projectLint = projectConfig.targets.lint;
  const projectServe = projectConfig.targets.serve;
  const projectTest = projectConfig.targets.test;

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
    },
    dependsOn: ['build-payload', 'generate-graphql', 'generate-types'],
  };

  targets.serve = {
    ...projectServe,
    configurations: {
      ...projectServe.configurations,
      development: {
        tsConfig: joinPathFragments(options.directory, 'tsconfig.dev.json'),
      },
    },
  };

  targets.lint = {
    ...projectLint,
  };

  targets.test = {
    ...projectTest,
  };

  targets['build-payload'] = {
    executor: 'nx:run-commands',
    defaultConfiguration: 'production',
    options: {
      command: 'yarn payload build',
    },
    configurations: {
      production: {
        outputPath: joinPathFragments('dist', options.directory),
      },
    },
  };

  targets['generate-types'] = {
    executor: 'nx:run-commands',
    options: {
      command: 'yarn payload generate:types',
    },
  };

  targets['generate-graphql'] = {
    executor: 'nx:run-commands',
    options: {
      command: 'yarn payload generate:graphQLSchema',
    },
  };

  const project: ProjectConfiguration = {
    name: projectConfig.name,
    root: projectConfig.root,
    sourceRoot: projectConfig.sourceRoot,
    projectType: projectConfig.projectType,
    targets,
    tags: projectConfig.tags,
  };

  updateProjectConfiguration(host, options.name, {
    ...project,
  });
}
