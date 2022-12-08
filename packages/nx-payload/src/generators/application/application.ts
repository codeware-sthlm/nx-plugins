import { Tree, convertNxGenerator, formatFiles, toJS } from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

import initGenerator from '../init/init';

import { createApplicationFiles } from './libs/create-application-files';
import { createDockerFiles } from './libs/create-docker-files';
import { createExpressApplication } from './libs/create-express-application';
import { normalizeOptions } from './libs/normalize-options';
import { setWorkspaceDefaults } from './libs/set-workspace-defaults';
import { updateGitignore } from './libs/update-gitignore';
import { updateProjectConfig } from './libs/update-project-config';
import { updateTsConfig } from './libs/update-tsconfig';
import { Schema } from './schema';

export async function applicationGenerator(host: Tree, schema: Schema) {
  const options = normalizeOptions(host, schema);

  // Initialize for Payload support
  const payloadTask = await initGenerator(host, {
    ...schema,
    skipFormat: true,
  });

  // Use Express plugin to scaffold a template application
  const expressTask = await createExpressApplication(host, options);

  // Create application files from template folder
  createApplicationFiles(host, options);

  // Application files
  updateProjectConfig(host, options);
  updateTsConfig(host, options);

  // Workspace root files
  createDockerFiles(host, options);
  setWorkspaceDefaults(host, options);
  updateGitignore(host);

  // Convert to JavaScript when required
  if (options.js) {
    toJS(host);
  }

  // Format files when not suppressed
  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(payloadTask, expressTask);
}

export default applicationGenerator;
export const applicationSchematic = convertNxGenerator(applicationGenerator);
