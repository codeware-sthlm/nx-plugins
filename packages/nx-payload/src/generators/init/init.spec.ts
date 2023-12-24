import { type Tree, addDependenciesToPackageJson, readJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import type { PackageJson } from 'nx/src/utils/package-json';

import {
  payloadPluginsVersions,
  payloadVersion,
  tsLibVersion,
} from '../../utils/versions';

import { initGenerator } from './init';

describe('init', () => {
  let tree: Tree;

  console.log = jest.fn();
  console.warn = jest.fn();

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should add payload dependency', async () => {
    await initGenerator(tree, {});
    const packageJson = readJson<PackageJson>(tree, 'package.json');

    expect(packageJson.dependencies['payload']).toBe(payloadVersion);
    expect(packageJson.devDependencies['payload']).toBeUndefined();
  });

  it('should add payload webpack dependency', async () => {
    await initGenerator(tree, {});

    const packageJson = readJson<PackageJson>(tree, 'package.json');
    expect(packageJson.dependencies['@payloadcms/bundler-webpack']).toBe(
      payloadPluginsVersions['@payloadcms/bundler-webpack'],
    );
    expect(
      packageJson.devDependencies['@payloadcms/bundler-webpack'],
    ).toBeUndefined();
  });

  it('should add payload mongodb dependency', async () => {
    await initGenerator(tree, {});
    const packageJson = readJson<PackageJson>(tree, 'package.json');

    expect(packageJson.dependencies['@payloadcms/db-mongodb']).toBe(
      payloadPluginsVersions['@payloadcms/db-mongodb'],
    );
    expect(
      packageJson.devDependencies['@payloadcms/db-mongodb'],
    ).toBeUndefined();
  });

  it('should add payload ricktext-slate dependency', async () => {
    await initGenerator(tree, {});
    const packageJson = readJson<PackageJson>(tree, 'package.json');

    expect(packageJson.dependencies['@payloadcms/richtext-slate']).toBe(
      payloadPluginsVersions['@payloadcms/richtext-slate'],
    );
    expect(
      packageJson.devDependencies['@payloadcms/richtext-slate'],
    ).toBeUndefined();
  });

  it('should add express dependencies', async () => {
    await initGenerator(tree, {});
    const packageJson = readJson<PackageJson>(tree, 'package.json');

    expect(packageJson.dependencies['@nx/express']).toBeUndefined();
    expect(packageJson.dependencies['express']).toBeDefined();
    expect(packageJson.devDependencies['@nx/express']).toBeDefined();
    expect(packageJson.devDependencies['express']).toBeUndefined();
  });

  it('should add mongo dependencies', async () => {
    await initGenerator(tree, {});
    const packageJson = readJson<PackageJson>(tree, 'package.json');

    expect(packageJson.dependencies['mongodb']).toBeUndefined();
    expect(packageJson.devDependencies['mongodb']).toBeDefined();
  });

  it('should add tslib dependency', async () => {
    await initGenerator(tree, {});
    const packageJson = readJson<PackageJson>(tree, 'package.json');

    expect(packageJson.dependencies['tslib']).toBe(tsLibVersion);
    expect(packageJson.devDependencies['tslib']).toBeUndefined();
  });

  it('should keep existing dependencies', async () => {
    const existing = 'existing';
    const existingVersion = '1.0.0';
    const dependencies = {
      [existing]: existingVersion,
    };
    const devDependencies = {
      [existing]: existingVersion,
    };
    addDependenciesToPackageJson(tree, dependencies, devDependencies);

    await initGenerator(tree, {});
    const packageJson = readJson<PackageJson>(tree, 'package.json');

    expect(packageJson.dependencies[existing]).toBeDefined();
    expect(packageJson.devDependencies[existing]).toBeDefined();
  });

  it('should not add jest config if unitTestRunner is none', async () => {
    await initGenerator(tree, { unitTestRunner: 'none' });

    expect(tree.exists('jest.config.js')).toEqual(false);
  });
});
