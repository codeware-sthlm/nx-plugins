import { Tree, addDependenciesToPackageJson, readJson } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import { payloadVersion } from '../../utils/versions';

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

  it('should add express dependencies', async () => {
    await initGenerator(tree, {});
    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.dependencies['@nrwl/express']).toBeUndefined();
    expect(packageJson.dependencies['express']).toBeDefined();
    expect(packageJson.devDependencies['@nrwl/express']).toBeDefined();
    expect(packageJson.devDependencies['express']).toBeUndefined();
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
