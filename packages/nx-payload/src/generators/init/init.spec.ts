import { Tree, addDependenciesToPackageJson, readJson } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import {
  payloadPluginsVersions,
  payloadVersion,
  tsLibVersion,
} from '../../utils/versions';

import { initGenerator } from './init';

describe('init', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should add payload dependency', async () => {
    await initGenerator(tree, {});
    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.dependencies['payload']).toBe(payloadVersion);
    expect(packageJson.devDependencies['payload']).toBeUndefined();
  });

  it('should add payload webpack dependency', async () => {
    await initGenerator(tree, {});
    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.dependencies['@payloadcms/bundler-webpack']).toBe(
      payloadPluginsVersions['@payloadcms/bundler-webpack']
    );
    expect(
      packageJson.devDependencies['@payloadcms/bundler-webpack']
    ).toBeUndefined();
  });

  it('should add payload mongodb dependency', async () => {
    await initGenerator(tree, {});
    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.dependencies['@payloadcms/db-mongodb']).toBe(
      payloadPluginsVersions['@payloadcms/db-mongodb']
    );
    expect(
      packageJson.devDependencies['@payloadcms/db-mongodb']
    ).toBeUndefined();
  });

  it('should add payload ricktext-slate dependency', async () => {
    await initGenerator(tree, {});
    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.dependencies['@payloadcms/richtext-slate']).toBe(
      payloadPluginsVersions['@payloadcms/richtext-slate']
    );
    expect(
      packageJson.devDependencies['@payloadcms/richtext-slate']
    ).toBeUndefined();
  });

  it('should add express dependencies', async () => {
    await initGenerator(tree, {});
    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.dependencies['@nrwl/express']).toBeUndefined();
    expect(packageJson.dependencies['express']).toBeDefined();
    expect(packageJson.devDependencies['@nrwl/express']).toBeDefined();
    expect(packageJson.devDependencies['express']).toBeUndefined();
  });

  it('should add tslib dependency', async () => {
    await initGenerator(tree, {});
    const packageJson = readJson(tree, 'package.json');
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
    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.dependencies[existing]).toBeDefined();
    expect(packageJson.devDependencies[existing]).toBeDefined();
  });

  it('should not add jest config if unitTestRunner is none', async () => {
    await initGenerator(tree, { unitTestRunner: 'none' });
    expect(tree.exists('jest.config.js')).toEqual(false);
  });
});
