import { runCommandAsync as _runCommandAsync } from '@nx/plugin/testing';

/**
 * Custom implementation of `runCommandAsync` provided from `@nx/plugin/testing`.
 *
 * Adds verbose logging to make problems easier to debug and detect.
 *
 * @param command Command to run
 * @param options Optional options
 *
 * @returns `true` when command run successfully
 */
export async function runCommandAsync(
  command: string,
  options: { cwd?: string; env?: object } = {}
): Promise<boolean> {
  const { stdout, stderr } = await _runCommandAsync(`${command} --verbose`, {
    silenceError: true,
    cwd: options.cwd,
    env: {
      CI: 'true',
      // Yarn 4
      YARN_ENABLE_HARDENED_MODE: '0',
      // Yarn 3
      YARN_ENABLE_IMMUTABLE_INSTALLS: 'false',
      ...options.env
    }
  });

  console.log(stdout);
  if (stderr) {
    console.log(stderr);
    return false;
  }

  return true;
}
