import { join } from 'path';

import { Tree, generateFiles, names } from '@nrwl/devkit';

import { NormalizedSchema } from './normalize-options';

export function createApplicationFiles(host: Tree, options: NormalizedSchema) {
  const templateVariables = {
    ...names(options.name),
    ...options,
    tmpl: '',
  };

  host.delete(`${options.projectName}/src/main.ts`);

  generateFiles(
    host,
    join(__dirname, '../files'),
    options.projectRoot,
    templateVariables
  );
}
