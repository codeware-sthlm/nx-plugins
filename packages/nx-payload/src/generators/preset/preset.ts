import {
  type GeneratorCallback,
  type Tree,
  formatFiles,
  runTasksInSerial
} from '@nx/devkit';

import applicationGenerator from '../application/application';

import { type PresetGeneratorSchema } from './schema';

export async function presetGenerator(
  tree: Tree,
  options: PresetGeneratorSchema
) {
  const tasks: GeneratorCallback[] = [];

  const name = options?.appName ?? options?.name ?? 'nx-payload-workspace';
  const directory = options?.appDirectory ?? `apps/${name}`;

  // Generate application
  const appGenTask = await applicationGenerator(tree, {
    ...options,
    name,
    directory
  });
  tasks.push(appGenTask);

  tree.delete('libs');

  await formatFiles(tree);

  return runTasksInSerial(...tasks);
}

export default presetGenerator;
