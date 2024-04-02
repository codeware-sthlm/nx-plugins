import type { NxJsonConfiguration, ProjectConfiguration } from '@nx/devkit';
import {
  cleanup,
  newNxProject,
  readJson,
  runNxCommand,
  uniq
} from '@nx/plugin/testing';

const myApp = uniq('my-app');
const myAppPath = `apps/${myApp}`;

describe('@cdwr/nx-payload/plugin', () => {
  let originalEnv: string;

  beforeAll(() => {
    originalEnv = process.env.NX_ADD_PLUGINS;
    process.env.NX_ADD_PLUGINS = 'true';
    newNxProject('@cdwr/nx-payload', 'dist/packages/nx-payload');
    runNxCommand(`g @cdwr/nx-payload:app ${myApp} --directory ${myAppPath}`);
  });

  afterAll(() => {
    process.env.NX_ADD_PLUGINS = originalEnv;
    runNxCommand('reset');
    cleanup();
  });

  it('should configure plugin without targets', () => {
    const nxJson = readJson<NxJsonConfiguration>('nx.json');
    const plugin = nxJson.plugins.find((p) => p === '@cdwr/nx-payload/plugin');
    expect(plugin).toEqual('@cdwr/nx-payload/plugin');
  });

  it('project.json should not contain build,payload targets', () => {
    const projectJson = readJson<ProjectConfiguration>(
      `${myAppPath}/project.json`
    );
    expect(projectJson.targets.build).toBeUndefined();
    expect(projectJson.targets.payload).toBeUndefined();
  });

  it('should build application', () => {
    const result = runNxCommand(`build ${myApp}`);
    expect(result).toContain('Successfully ran target build');
  }, 300_000);

  it('should invoke payload cli', () => {
    const result = runNxCommand(`payload ${myApp}`);
    expect(result).toContain('Successfully ran target payload');
  }, 300_000);
});
