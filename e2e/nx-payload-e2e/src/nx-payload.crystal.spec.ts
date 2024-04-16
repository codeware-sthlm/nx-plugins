import {
  type NxJsonConfiguration,
  type ProjectConfiguration
} from '@nx/devkit';
import {
  ensureNxProject,
  readJson,
  runNxCommand,
  uniq,
  updateFile
} from '@nx/plugin/testing';

describe('@cdwr/nx-payload/plugin', () => {
  let myApp = uniq('my-app');
  let myAppPath = `apps/${myApp}`;

  let originalEnv: string;

  jest.setTimeout(300_000);

  beforeAll(() => {
    // Make sure plugin inference is enabled
    originalEnv = process.env.NX_ADD_PLUGINS;
    process.env.NX_ADD_PLUGINS = 'true';

    ensureNxProject('@cdwr/nx-payload', 'dist/packages/nx-payload');
    runNxCommand(`g @cdwr/nx-payload:app ${myApp} --directory ${myAppPath}`);
  });

  afterAll(() => {
    process.env.NX_ADD_PLUGINS = originalEnv;
    runNxCommand('reset');
  });

  it('should configure plugin without custom target names', () => {
    const nxJson = readJson<NxJsonConfiguration>('nx.json');
    const plugin = nxJson.plugins.find((p) => p === '@cdwr/nx-payload/plugin');
    expect(plugin).toEqual('@cdwr/nx-payload/plugin');
  });

  it('should not have any inferred targets in project.json', () => {
    const projectJson = readJson<ProjectConfiguration>(
      `${myAppPath}/project.json`
    );

    ['build', 'mongodb', 'payload', 'postgres', 'start', 'stop'].forEach(
      (target) => {
        expect(projectJson.targets[target]).toBeUndefined();
      }
    );
  });

  it('should resolve inferred projects', () => {
    const projectConfig: ProjectConfiguration = JSON.parse(
      runNxCommand(`show project ${myApp} --json`)
    );

    ['build', 'mongodb', 'payload', 'postgres', 'start', 'stop'].forEach(
      (target) => {
        expect(projectConfig.targets[target]).toBeDefined();
      }
    );
  });

  it('should build application', () => {
    const result = runNxCommand(`build ${myApp}`);
    expect(result).toContain('Successfully ran target build');
  });

  it('should invoke payload cli', () => {
    const result = runNxCommand(`payload ${myApp}`);
    expect(result).toContain('Successfully ran target payload');
  });

  it('opt out with usePluginInference set to false', () => {
    myApp = uniq('my-app');
    myAppPath = `apps/${myApp}`;

    updateFile('nx.json', (content) => {
      const nxJson = JSON.parse(content);
      nxJson.useInferencePlugins = false;
      return JSON.stringify(nxJson);
    });

    const nxJson = readJson<NxJsonConfiguration>('nx.json');
    expect(nxJson.useInferencePlugins).toBe(false);
    expect(process.env.NX_ADD_PLUGINS).toBe('true');

    runNxCommand(`g @cdwr/nx-payload:app ${myApp} --directory ${myAppPath}`);

    const projectJson = readJson<ProjectConfiguration>(
      `apps/${myApp}/project.json`
    );

    ['build', 'payload'].forEach((target) => {
      expect(projectJson.targets[target]).toBeDefined();
    });
    ['mongodb', 'postgres', 'start', 'stop'].forEach((target) => {
      expect(projectJson.targets[target]).toBeUndefined();
    });
  });
});
