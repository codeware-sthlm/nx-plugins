import {
  getWorkspaceLayout,
  joinPathFragments,
  names,
  Tree,
} from '@nrwl/devkit';
import { Linter } from '@nrwl/linter';
import { Tracing } from 'trace_events';

import { Schema } from '../schema';

export interface NormalizedSchema extends Schema {
  projectName: string;
  projectRoot: string;
  parsedTags: string[];
  fileName: string;
  linter: Linter;
  unitTestRunner: 'jest' | 'none';
  js: boolean;
}

export function normalizeOptions(
  host: Tree,
  options: Schema
): NormalizedSchema {
  const appDirectory = options.directory
    ? `${names(options.directory).fileName}/${names(options.name).fileName}`
    : names(options.name).fileName;

  const { appsDir } = getWorkspaceLayout(host);

  const projectName = appDirectory.replace(new RegExp('/', 'g'), '-');

  const projectRoot = joinPathFragments(appsDir, appDirectory);

  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  const fileName = 'index';

  return {
    ...options,
    name: names(options.name).fileName,
    projectName,
    projectRoot,
    linter: options.linter || Linter.EsLint,
    unitTestRunner: options.unitTestRunner || 'jest',
    standaloneConfig: options.standaloneConfig || true,
    js: options.js || false,
    parsedTags,
    fileName,
  };
}
