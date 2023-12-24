import { type Tree, names } from '@nx/devkit';
import { Linter } from '@nx/eslint';

import type { Schema } from '../schema';

export type NormalizedSchema = Required<Schema>;

export function normalizeOptions(
  host: Tree,
  options: Schema,
): NormalizedSchema {
  return {
    ...options,
    name: names(options.name).fileName,
    linter: options?.linter || Linter.EsLint,
    unitTestRunner: options?.unitTestRunner || 'jest',
    projectNameAndRootFormat: 'as-provided',
    tags: options?.tags || '',
    skipE2e: options?.skipE2e || false,
  };
}
