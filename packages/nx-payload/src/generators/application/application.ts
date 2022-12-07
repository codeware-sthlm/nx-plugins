import { Tree, convertNxGenerator, formatFiles } from '@nrwl/devkit';

import { Schema } from './schema';
import initGenerator from '../init/init';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { normalizeOptions } from './libs/normalize-options';
import { createExpressApplication } from './libs/create-express-application';
import { setWorkspaceDefaults } from './libs/set-workspace-defaults';
import { updateProject } from './libs/update-project';

export async function applicationGenerator(host: Tree, schema: Schema) {
  const options = normalizeOptions(host, schema);

  const payloadTask = await initGenerator(host, {
    ...schema,
    skipFormat: true,
  });

  const expressTask = await createExpressApplication(host, options);

  // createApplicationFiles(host, options);
  // createExpressServerFiles(host, options);
  updateProject(host, options);

  // TODO: do we need to customize scaffolded files?
  //  > .eslintrc?
  //  > jest.config.ts

  setWorkspaceDefaults(host, options);

  // addFiles(host, options);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(payloadTask, expressTask);
}

export default applicationGenerator;
export const applicationSchematic = convertNxGenerator(applicationGenerator);
