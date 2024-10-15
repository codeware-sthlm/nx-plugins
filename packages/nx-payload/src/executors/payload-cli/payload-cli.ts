import { join } from 'path';

import { type ExecutorContext, getPackageManagerCommand } from '@nx/devkit';
import runCommandsImpl from 'nx/src/executors/run-commands/run-commands.impl';

import { normalizeOptions } from './libs/normalize-options';
import type { PayloadCliExecutorSchema } from './schema';

export async function payloadCliExecutor(
  options: PayloadCliExecutorSchema,
  context: ExecutorContext
) {
  const normalizedOptions = normalizeOptions(options, context);

  const cliArgs = options?._ ?? [];

  const pmc = getPackageManagerCommand();

  const output = await runCommandsImpl(
    {
      command: `${pmc.exec} payload ${cliArgs.join(' ')}`,
      envFile: join(normalizedOptions.projectRoot, '.env.payload'),
      __unparsed__: []
    },
    context
  );

  if (!output.success) {
    return {
      success: false
    };
  }

  return {
    success: true
  };
}

export default payloadCliExecutor;
