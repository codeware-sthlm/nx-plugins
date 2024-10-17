import { join } from 'path';

import {
  type ExecutorContext,
  getPackageManagerCommand,
  logger
} from '@nx/devkit';
import runCommandsImpl from 'nx/src/executors/run-commands/run-commands.impl';

import { normalizeOptions } from './libs/normalize-options';
import type { PayloadBuildExecutorSchema } from './schema';

export async function payloadBuildExecutor(
  options: PayloadBuildExecutorSchema,
  context: ExecutorContext
) {
  const normalizedOptions = normalizeOptions(options, context);

  // Since build target depends on this target, we must start with a clean output
  const preCleanup = normalizedOptions.outputPath
    ? [`rimraf ${normalizedOptions.outputPath} || true`]
    : [];

  const pmc = getPackageManagerCommand();

  const output = await runCommandsImpl(
    {
      commands: [
        ...preCleanup,
        `${pmc.exec} payload build`,
        `${pmc.exec} payload generate:types`,
        `${pmc.exec} payload generate:graphQLSchema`
      ],
      parallel: false,
      envFile: join(normalizedOptions.projectRoot, '.env.payload'),
      __unparsed__: []
    },
    context
  );

  if (!output.success) {
    logger.error('Could not compile payload');
    logger.error(output.terminalOutput);

    return {
      success: false
    };
  }

  return {
    success: true
  };
}

export default payloadBuildExecutor;
