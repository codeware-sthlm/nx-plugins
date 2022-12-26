import { Tree } from '@nrwl/devkit';
import { applicationGenerator } from '@nrwl/express';

import { NormalizedSchema } from './normalize-options';

export async function createExpressApplication(
  host: Tree,
  options: NormalizedSchema
) {
  const expressTask = await applicationGenerator(host, {
    ...options,
    js: false,
    skipFormat: true,
    skipPackageJson: false,
    pascalCaseFiles: false,
  });

  return expressTask;
}
