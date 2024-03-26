import { join } from 'path';

import { type ExecutorContext, logger } from '@nx/devkit';
import tscExecutor from '@nx/js/src/executors/tsc/tsc.impl';
import runCommandsImpl from 'nx/src/executors/run-commands/run-commands.impl';

import { normalizeOptions } from './libs/normalize-options';
import type { BuildExecutorSchema } from './schema';

export async function buildExecutor(
  options: BuildExecutorSchema,
  context: ExecutorContext
) {
  const normalizedOptions = normalizeOptions(options, context);

  for await (const output of tscExecutor(normalizedOptions, context)) {
    if (!output.success) {
      logger.error('Could not compile application files');
      return {
        success: false
      };
    }
  }

  logger.info('Building payload...');

  const output = await runCommandsImpl(
    {
      commands: [
        'npx payload build',
        'npx payload generate:types',
        'npx payload generate:graphQLSchema'
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

export default buildExecutor;
