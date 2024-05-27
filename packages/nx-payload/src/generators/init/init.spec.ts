import { type Tree, addDependenciesToPackageJson, readJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { type PackageJson } from 'nx/src/utils/package-json';

import {
  payloadPluginsVersions,
  payloadVersion,
  rimrafVersion,
  tsLibVersion
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

  it('should add payload webpack to dependencies', async () => {
    await initGenerator(tree, {});

    const packageJson = readJson<PackageJson>(tree, 'package.json');
    expect(packageJson.dependencies['@payloadcms/bundler-webpack']).toBe(
      payloadPluginsVersions['@payloadcms/bundler-webpack']
    );
    expect(
      packageJson.devDependencies['@payloadcms/bundler-webpack']
    ).toBeUndefined();
  });

  it('should add payload mongodb to dependencies', async () => {
    await initGenerator(tree, {});
    const packageJson = readJson<PackageJson>(tree, 'package.json');

    expect(packageJson.dependencies['@payloadcms/db-mongodb']).toBe(
      payloadPluginsVersions['@payloadcms/db-mongodb']
    );
    expect(
      packageJson.devDependencies['@payloadcms/db-mongodb']
    ).toBeUndefined();
  });

  it('should add payload postgres to dependencies', async () => {
    await initGenerator(tree, {});
    const packageJson = readJson<PackageJson>(tree, 'package.json');

    expect(packageJson.dependencies['@payloadcms/db-postgres']).toBe(
      payloadPluginsVersions['@payloadcms/db-postgres']
    );
    expect(
      packageJson.devDependencies['@payloadcms/db-postgres']
    ).toBeUndefined();
  });

  it('should add payload richtext-slate to dependencies', async () => {
    await initGenerator(tree, {});
    const packageJson = readJson<PackageJson>(tree, 'package.json');

    expect(packageJson.dependencies['@payloadcms/richtext-slate']).toBe(
      payloadPluginsVersions['@payloadcms/richtext-slate']
    );
    expect(
      packageJson.devDependencies['@payloadcms/richtext-slate']
    ).toBeUndefined();
  });

  it('should add express to dependencies', async () => {
    await initGenerator(tree, {});
    const packageJson = readJson<PackageJson>(tree, 'package.json');

    expect(packageJson.dependencies['@nx/express']).toBeUndefined();
    expect(packageJson.dependencies['express']).toBeDefined();
    expect(packageJson.devDependencies['@nx/express']).toBeDefined();
    expect(packageJson.devDependencies['express']).toBeUndefined();
  });

  it('should add rimraf to dependencies', async () => {
    await initGenerator(tree, {});
    const packageJson = readJson<PackageJson>(tree, 'package.json');

    expect(packageJson.dependencies['rimraf']).toBeUndefined();
    expect(packageJson.devDependencies['rimraf']).toBe(rimrafVersion);
  });

  it('should add tslib to dependencies', async () => {
    await initGenerator(tree, {});
    const packageJson = readJson<PackageJson>(tree, 'package.json');

    expect(packageJson.dependencies['tslib']).toBe(tsLibVersion);
    expect(packageJson.devDependencies['tslib']).toBeUndefined();
  });

  it('should keep existing dependencies', async () => {
    const existing = 'existing';
    const existingVersion = '1.0.0';
    const dependencies = {
      [existing]: existingVersion
    };
    const devDependencies = {
      [existing]: existingVersion
    };
    addDependenciesToPackageJson(tree, dependencies, devDependencies);

    await initGenerator(tree, {});
    const packageJson = readJson<PackageJson>(tree, 'package.json');

    expect(packageJson.dependencies[existing]).toBeDefined();
    expect(packageJson.devDependencies[existing]).toBeDefined();
  });
});
