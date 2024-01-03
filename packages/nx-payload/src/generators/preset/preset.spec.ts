import { Tree, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { presetGenerator } from './preset';
import { PresetGeneratorSchema } from './schema';

describe('preset generator', () => {
  let tree: Tree;
  const options: PresetGeneratorSchema = {
    name: 'test',
    appName: 'test-app',
    appDirectory: 'apps/test-app',
    skipE2e: true,
    unitTestRunner: 'none'
  };

  console.log = jest.fn();
  console.warn = jest.fn();

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should generate app', async () => {
    await presetGenerator(tree, options);

    const config = readProjectConfiguration(tree, 'test-app');
    expect(config.name).toBe('test-app');
    expect(config.sourceRoot).toBe('apps/test-app/src');
    expect(config.tags).toEqual([]);
    expect(config.targets['test']).toEqual({});
  });
});
