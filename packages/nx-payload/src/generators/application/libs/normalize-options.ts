import { type Tree, names } from '@nx/devkit';
import { Linter } from '@nx/eslint';

import type { AppGeneratorSchema } from '../schema';

export type NormalizedSchema = Required<AppGeneratorSchema>;

export function normalizeOptions(
  host: Tree,
  options: AppGeneratorSchema
): NormalizedSchema {
  return {
    name: names(options.name).fileName,
    directory: options.directory,
    linter: options?.linter || Linter.EsLint,
    projectNameAndRootFormat: 'as-provided',
    skipFormat: options?.skipFormat || false,
    skipE2e: options?.skipE2e || false,
    tags: options?.tags || '',
    unitTestRunner: options?.unitTestRunner || 'jest'
  };
}
