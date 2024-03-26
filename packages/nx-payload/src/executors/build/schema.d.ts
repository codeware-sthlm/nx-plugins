import { ExecutorOptions } from '@nx/js/src/utils/schema';

export type BuildExecutorSchema = ExecutorOptions & {
  updateBuildableProjectDepsInPackageJson: boolean;
  buildableProjectDepsInPackageJsonType:
    | 'dependencies'
    | 'devDependencies'
    | 'none';
};
