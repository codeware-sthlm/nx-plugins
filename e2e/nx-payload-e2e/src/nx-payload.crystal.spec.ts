import type { NxJsonConfiguration, ProjectConfiguration } from '@nx/devkit';
import { readJson, runNxCommand, uniq, updateFile } from '@nx/plugin/testing';
import { ensureCreateNxWorkspaceProject } from '@nx-plugins/e2e/utils';

describe('@cdwr/nx-payload/plugin', () => {
  let appName: string;
  let appDirectory: string;

  let originalEnv: string;

  jest.setTimeout(300_000);

  beforeAll(() => {
    // Make sure plugin inference is enabled
    originalEnv = process.env.NX_ADD_PLUGINS;
    process.env.NX_ADD_PLUGINS = 'true';

    const project = ensureCreateNxWorkspaceProject({
      preset: '@cdwr/nx-payload'
    });
    appName = project.appName;
    appDirectory = project.appDirectory;
  });

  afterAll(() => {
    process.env.NX_ADD_PLUGINS = originalEnv;
    runNxCommand('reset', { silenceError: true });
  });

  it('should configure plugin without custom target names', () => {
    const nxJson = readJson<NxJsonConfiguration>('nx.json');
    const plugin = nxJson.plugins.find((p) => p === '@cdwr/nx-payload/plugin');
    expect(plugin).toEqual('@cdwr/nx-payload/plugin');
  });

  it('should not have any inferred targets in project.json', () => {
    const projectJson = readJson<ProjectConfiguration>(
      `${appDirectory}/project.json`
    );

    [
      'build',
      'mongodb',
      'payload-build',
      'payload-cli',
      'postgres',
      'start',
      'stop'
    ].forEach((target) => {
      expect(projectJson.targets[target]).toBeUndefined();
    });
  });

  it('should resolve inferred projects', () => {
    const projectConfig: ProjectConfiguration = JSON.parse(
      runNxCommand(`show project ${appName} --json`)
    );

    [
      'build',
      'mongodb',
      'payload-build',
      'payload-cli',
      'postgres',
      'start',
      'stop'
    ].forEach((target) => {
      expect(projectConfig.targets[target]).toBeDefined();
    });
  });

  it('should build application', () => {
    const result = runNxCommand(`build ${appName}`);
    expect(result).toContain('Successfully ran target build');
  });

  it('should invoke payload cli', () => {
    const result = runNxCommand(`payload-cli ${appName}`);
    expect(result).toContain('Successfully ran target payload-cli');
  });

  it('opt out with usePluginInference set to false', () => {
    appName = uniq('my-app');
    appDirectory = `apps/${appName}`;

    updateFile('nx.json', (content) => {
      const nxJson = JSON.parse(content);
      nxJson.useInferencePlugins = false;
      return JSON.stringify(nxJson);
    });

    const nxJson = readJson<NxJsonConfiguration>('nx.json');
    expect(nxJson.useInferencePlugins).toBe(false);
    expect(process.env.NX_ADD_PLUGINS).toBe('true');

    runNxCommand(
      `g @cdwr/nx-payload:app ${appName} --directory ${appDirectory}`
    );

    const projectJson = readJson<ProjectConfiguration>(
      `apps/${appName}/project.json`
    );

    ['build', 'payload-build', 'payload-cli'].forEach((target) => {
      expect(projectJson.targets[target]).toBeDefined();
    });
    ['mongodb', 'postgres', 'start', 'stop'].forEach((target) => {
      expect(projectJson.targets[target]).toBeUndefined();
    });
  });
});
