import { exec } from 'child_process';
import { promisify } from 'util';

import chalk from 'chalk';
import { releasePublish } from 'nx/release';

/**
 * Publish packages with pending releases to registry
 *
 * @param options Publish options
 * @returns zero if all projects are published successfully, non-zero if not
 */
export const publish = async (options: {
  otp: number;
  dryRun?: boolean;
  verbose?: boolean;
}): Promise<number> => {
  const { otp, dryRun, verbose } = options;

  console.log(`${chalk.magenta.underline('Publish packages')}\n`);

  try {
    const { stdout } = await promisify(exec)('yarn nx run-many -t build');
    console.log(stdout);

    return releasePublish({
      dryRun,
      verbose,
      otp
    });
  } catch (error) {
    console.error(`Publish packages: ${chalk.red((error as Error).message)}`);
    return 1;
  }
};
