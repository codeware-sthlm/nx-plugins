import {
  type GeneratorCallback,
  type Tree,
  convertNxGenerator,
  formatFiles,
  runTasksInSerial
} from '@nx/devkit';

import initGenerator from '../init/init';

import { createApplicationFiles } from './libs/create-application-files';
import { createDockerfile } from './libs/create-dockerfile';
import { createExpressApplication } from './libs/create-express-application';
import { normalizeOptions } from './libs/normalize-options';
import { setWorkspaceDefaults } from './libs/set-workspace-defaults';
import { updateEslintignore } from './libs/update-eslintignore';
import { updateGitignore } from './libs/update-gitignore';
import { updateProjectConfig } from './libs/update-project-config';
import { updateTsConfig } from './libs/update-tsconfig';
import { type AppGeneratorSchema } from './schema';

export async function applicationGenerator(
  host: Tree,
  schema: AppGeneratorSchema
): Promise<GeneratorCallback> {
  const options = normalizeOptions(host, schema);

  // Initialize for Payload support
  const payloadTask = await initGenerator(host, schema);

  // Use Express plugin to scaffold a template application
  const expressTask = await createExpressApplication(host, options);

  // Create application files from template folder
  createApplicationFiles(host, options);

  // Create application files dynamically
  createDockerfile(host, options);

  // Application config files
  updateProjectConfig(host, options);
  updateTsConfig(host, options);

  // Workspace root config files
  setWorkspaceDefaults(host, options);
  updateEslintignore(host);
  updateGitignore(host);

  // Format files
  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(payloadTask, expressTask);
}

export default applicationGenerator;
export const applicationSchematic = convertNxGenerator(applicationGenerator);
