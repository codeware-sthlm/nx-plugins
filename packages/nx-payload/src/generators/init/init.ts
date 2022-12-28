import {
  GeneratorCallback,
  Tree,
  addDependenciesToPackageJson,
  convertNxGenerator,
  formatFiles,
} from '@nrwl/devkit';
import { initGenerator as expressInitGenerator } from '@nrwl/express/src/generators/init/init';
import { jestInitGenerator } from '@nrwl/jest';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

import { payloadVersion, tsLibVersion } from '../../utils/versions';

import { Schema } from './schema';

function updateDependencies(tree: Tree) {
  return addDependenciesToPackageJson(
    tree,
    {
      payload: payloadVersion,
      tslib: tsLibVersion,
    },
    {}
  );
}

export async function initGenerator(tree: Tree, schema: Schema) {
  const tasks: GeneratorCallback[] = [];

  if (!schema.unitTestRunner || schema.unitTestRunner === 'jest') {
    const jestTask = jestInitGenerator(tree, {});
    tasks.push(jestTask);
  }

  const expressTask = await expressInitGenerator(tree, schema);
  tasks.push(expressTask);

  const installTask = updateDependencies(tree);
  tasks.push(installTask);

  await formatFiles(tree);

  return runTasksInSerial(...tasks);
}

export default initGenerator;
export const initSchematic = convertNxGenerator(initGenerator);
