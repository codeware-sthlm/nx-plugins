import { type Tree, readJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import type { PackageJson } from 'nx/src/utils/package-json';

import generator from './application';
import type { AppGeneratorSchema } from './schema';

describe('application generator', () => {
  let tree: Tree;
  const options: AppGeneratorSchema = {
    directory: 'apps/test-dir',
    name: 'test-app'
  };

  console.log = jest.fn();
  console.warn = jest.fn();

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should add payload dependencies', async () => {
    await generator(tree, options);
    const packageJson = readJson<PackageJson>(tree, 'package.json');

    expect(packageJson.dependencies['payload']).toBeDefined();
    expect(
      packageJson.dependencies['@payloadcms/bundler-webpack']
    ).toBeDefined();
    expect(packageJson.dependencies['@payloadcms/db-mongodb']).toBeDefined();
    expect(
      packageJson.dependencies['@payloadcms/richtext-slate']
    ).toBeDefined();
  });

  it('should add dependencies for express', async () => {
    await generator(tree, options);
    const packageJson = readJson<PackageJson>(tree, 'package.json');

    expect(packageJson.dependencies['express']).toBeDefined();
    expect(packageJson.devDependencies['@types/express']).toBeDefined();
  });

  it('should add dependencies for mongo', async () => {
    await generator(tree, options);
    const packageJson = readJson<PackageJson>(tree, 'package.json');

    expect(packageJson.devDependencies['mongodb']).toBeDefined();
  });

  it('should add payload project files', async () => {
    await generator(tree, options);

    expect(
      tree.exists(`${options.directory}/src/payload.config.ts`)
    ).toBeTruthy();

    expect(tree.exists(`${options.directory}/.eslintrc.json`)).toBeTruthy();

    expect(tree.exists(`${options.directory}/tsconfig.app.json`)).toBeTruthy();
    expect(tree.exists(`${options.directory}/tsconfig.dev.json`)).toBeTruthy();
    expect(tree.exists(`${options.directory}/tsconfig.json`)).toBeTruthy();
    expect(tree.exists(`${options.directory}/tsconfig.spec.json`)).toBeTruthy();

    expect(tree.exists(`${options.directory}/webpack.config.js`)).toBeTruthy();
  });

  it('should add express project files', async () => {
    await generator(tree, options);

    expect(tree.exists(`${options.directory}/webpack.config.js`)).toBeTruthy();
  });

  it('should create payload e2e application', async () => {
    await generator(tree, options);

    expect(tree.exists(`${options.directory}-e2e/project.json`)).toBeTruthy();
  });

  it('should skip payload e2e application', async () => {
    await generator(tree, { ...options, skipE2e: true });

    expect(tree.exists(`${options.directory}-e2e/project.json`)).toBeFalsy();
  });

  it('should add docker files', async () => {
    await generator(tree, options);

    expect(tree.exists(`${options.directory}/docker-compose.yml`)).toBeTruthy();
    expect(tree.exists(`${options.directory}/Dockerfile`)).toBeTruthy();
    expect(
      tree.exists(`${options.directory}/Dockerfile.dockerignore`)
    ).toBeTruthy();
  });

  // @see https://github.com/nrwl/nx/blob/master/packages/remix/src/generators/application/application.impl.spec.ts
  it.todo('should test all options');
});
