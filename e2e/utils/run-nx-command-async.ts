import { runNxCommandAsync as _runNxCommandAsync } from '@nx/plugin/testing';

/**
 * Custom implementation of `runNxCommandAsync` provided from `@nx/plugin/testing`.
 *
 * Adds verbose logging to make problems easier to debug and detect.
 *
 * @param command Command to run
 * @param options Optional options
 *
 * @returns `true` when command run successfully
 */
export async function runNxCommandAsync(
  command: string,
  options: { env?: object } = {}
): Promise<boolean> {
  const { stdout, stderr } = await _runNxCommandAsync(`${command} --verbose`, {
    silenceError: true,
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
