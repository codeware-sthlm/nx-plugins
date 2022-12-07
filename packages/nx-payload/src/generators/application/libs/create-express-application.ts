import { Tree } from '@nrwl/devkit';
import { NormalizedSchema } from './normalize-options';
import { applicationGenerator } from '@nrwl/express';

export async function createExpressApplication(
  host: Tree,
  options: NormalizedSchema
) {
  const expressTask = await applicationGenerator(host, {
    ...options,
    skipFormat: true,
    skipPackageJson: false,
    pascalCaseFiles: false,
  });

  return expressTask;
}
