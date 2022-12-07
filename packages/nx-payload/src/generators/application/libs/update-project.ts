import { NormalizedSchema } from './normalize-options';
import {
  joinPathFragments,
  ProjectConfiguration,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';

export function updateProject(host: Tree, options: NormalizedSchema) {
  const targets: Record<string, any> = {};

  const projectConfig = readProjectConfiguration(host, options.projectName);

  const projectBuild = projectConfig.targets.build;
  const projectLint = projectConfig.targets.lint;
  const projectServe = projectConfig.targets.serve;
  const projectTest = projectConfig.targets.test;

  targets.build = {
    ...projectBuild,
    executor: '@nrwl/js:tsc',
    options: {
      outputPath: joinPathFragments('dist', options.projectRoot),
      main: joinPathFragments(options.projectRoot, 'src', 'main.ts'),
      tsConfig: joinPathFragments(options.projectRoot, 'tsconfig.app.json'),
      assets: [joinPathFragments(options.projectRoot, 'src', 'assets')],
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
        tsConfig: joinPathFragments(options.projectRoot, 'tsconfig.dev.json'),
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
        outputPath: joinPathFragments('dist', options.projectRoot),
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

  updateProjectConfiguration(host, options.projectName, {
    ...project,
  });
}
