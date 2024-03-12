import { type Tree, readJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { type PackageJson } from 'nx/src/utils/package-json';

import generator from './application';
import { type AppGeneratorSchema } from './schema';

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

  it('should add payload dependency', async () => {
    await generator(tree, options);
    const packageJson = readJson<PackageJson>(tree, 'package.json');

    expect(packageJson.dependencies['payload']).toBeDefined();
  });

  it('should add webpack bundler dependency', async () => {
    await generator(tree, options);
    const packageJson = readJson<PackageJson>(tree, 'package.json');

    expect(
      packageJson.dependencies['@payloadcms/bundler-webpack']
    ).toBeDefined();
  });

  it('should add mongodb plugin dependency', async () => {
    await generator(tree, options);
    const packageJson = readJson<PackageJson>(tree, 'package.json');

    expect(packageJson.dependencies['@payloadcms/db-mongodb']).toBeDefined();
  });

  it('should add postgres plugin dependency', async () => {
    await generator(tree, options);
    const packageJson = readJson<PackageJson>(tree, 'package.json');

    expect(packageJson.dependencies['@payloadcms/db-postgres']).toBeDefined();
  });

  it('should add richtext slate editor plugin dependency', async () => {
    await generator(tree, options);
    const packageJson = readJson<PackageJson>(tree, 'package.json');

    expect(
      packageJson.dependencies['@payloadcms/richtext-slate']
    ).toBeDefined();
  });

  it('should add dependencies for express', async () => {
    await generator(tree, options);
    const packageJson = readJson<PackageJson>(tree, 'package.json');

    expect(packageJson.dependencies['express']).toBeDefined();
    expect(packageJson.dependencies['@nx/express']).toBeUndefined();
    expect(packageJson.devDependencies['@nx/express']).toBeDefined();
  });

  it('should not add dependencies for mongodb or postgres', async () => {
    await generator(tree, options);
    const packageJson = readJson<PackageJson>(tree, 'package.json');

    expect(packageJson.dependencies['mongodb']).toBeUndefined();
    expect(packageJson.dependencies['pg']).toBeUndefined();

    expect(packageJson.devDependencies['mongodb']).toBeUndefined();
    expect(packageJson.devDependencies['pg']).toBeUndefined();
  });

  it('should add payload project files', async () => {
    await generator(tree, options);

    expect(
      tree.exists(`${options.directory}/src/payload.config.ts`)
    ).toBeTruthy();

    expect(tree.exists(`${options.directory}/.eslintrc.json`)).toBeTruthy();

    expect(tree.exists(`${options.directory}/tsconfig.app.json`)).toBeTruthy();
    expect(tree.exists(`${options.directory}/tsconfig.json`)).toBeTruthy();
    expect(tree.exists(`${options.directory}/tsconfig.spec.json`)).toBeTruthy();

    expect(tree.exists(`${options.directory}/webpack.config.js`)).toBeTruthy();
  });

  it('should exclude folders with run-time generated files on build', async () => {
    await generator(tree, options);

    const content: {
      extends: string;
      compilerOptions: object;
      exclude: Array<string>;
      include: Array<string>;
    } = JSON.parse(
      tree.read(`${options.directory}/tsconfig.app.json`, 'utf-8')
    );

    expect(
      content.exclude.filter(
        (e) => e === 'src/generated/*.ts' || e === 'src/migrations/*.ts'
      ).length
    ).toBe(2);

    expect(content.extends).toBe('./tsconfig.json');
    expect(Object.keys(content.compilerOptions).length).toBeGreaterThan(0);
    expect(content.include.length).toBeGreaterThan(0);
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

  it('should add dotenv files', async () => {
    await generator(tree, options);

    expect(tree.exists(`${options.directory}/.env`)).toBeTruthy();
    expect(tree.exists(`${options.directory}/.env.serve`)).toBeTruthy();
  });

  it('should add folders for auto generated files', async () => {
    await generator(tree, options);

    expect(
      tree.exists(`${options.directory}/src/generated/.gitkeep`)
    ).toBeTruthy();

    expect(
      tree.exists(`${options.directory}/src/migrations/.gitkeep`)
    ).toBeTruthy();
  });

  it('should setup mongodb in payload config by default', async () => {
    await generator(tree, { ...options, database: undefined });

    const content = tree.read(
      `${options.directory}/src/payload.config.ts`,
      'utf-8'
    );
    expect(content.match(/mongooseAdapter|MONGO_URL/g).length).toBe(3);
  });

  it('should setup mongodb in payload config', async () => {
    await generator(tree, { ...options, database: 'mongodb' });

    const content = tree.read(
      `${options.directory}/src/payload.config.ts`,
      'utf-8'
    );
    expect(content.match(/mongooseAdapter|MONGO_URL/g).length).toBe(3);
    expect(content.match(/postgresAdapter|POSTGRES_URL/g)).toBeNull();
  });

  it('should setup postgres in payload config', async () => {
    await generator(tree, { ...options, database: 'postgres' });

    const content = tree.read(
      `${options.directory}/src/payload.config.ts`,
      'utf-8'
    );
    expect(content.match(/mongooseAdapter|MONGO_URL/g)).toBeNull();
    expect(content.match(/postgresAdapter|POSTGRES_URL/g).length).toBe(3);
  });

  // @see https://github.com/nrwl/nx/blob/master/packages/remix/src/generators/application/application.impl.spec.ts
  it.todo('should test all options');
});
