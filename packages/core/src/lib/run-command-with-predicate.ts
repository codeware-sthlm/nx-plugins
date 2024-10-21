import { exec } from 'child_process';

import { tmpProjPath } from '@nx/plugin/testing';

import { killProcessTree } from './kill-process-tree';
import { logDebug, logError } from './log-utils';

type Options = {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  verbose?: boolean;
  errorDetector?: RegExp;
};

/**
 * Run an Nx command and exit gracefully when the provided predicate function is true.
 *
 * The command is executed inside the e2e project directory.
 *
 * The predicate function is called for each log line and should return `true` to exit the running process.
 *
 * This function is a replacement for `runNxCommand` when the command isn't terminated by itself,
 * for example when running a `serve` command.
 *
 * @param command Nx command to run
 * @param doneFn Predicate function to determine when to exit the running process
 * @param options Options to pass when executing the command
 * @returns Complete logs output from the executed command
 *
 * @example
 * ```ts
 * const output = await runCommandWithPredicate('serve my-app', (log) =>
 *   log.includes('listening on port 3000')
 * );
 * expect(output.includes('some expected log output')).toBeTruthy();
 * ```
 */
export function runCommandWithPredicate(
  command: string,
  doneFn: (log: string) => boolean,

  options?: Options
): Promise<string> {
  const cwd = options?.cwd ?? tmpProjPath();
  const env = options?.env ?? process.env;
  const errorDetector = options?.errorDetector ?? /Error:/;
  const verbose = options?.verbose;

  const execCmd = `nx ${command}`;
  verbose && logDebug('Running command...', execCmd);

  const p = exec(execCmd, {
    cwd,
    encoding: 'utf-8',
    env
  });

  return new Promise((resolve, reject) => {
    let output = '';
    let complete = false;

    // Check if the predicate function is met
    const checkDone = (log: string) => {
      verbose && logDebug(log);
      output += log;
      if (doneFn(log) && !complete) {
        complete = true;
        terminate(output, 'success');
      }
    };

    // Kill the process tree and resolve when successful, otherwise reject with the error
    const terminate = (result: string, status: 'success' | 'fail') => {
      killProcessTree(Number(p.pid), 'SIGKILL')
        .then(() => (status === 'success' ? resolve(result) : reject(result)))
        .catch(reject);
    };

    // Let predicate function check the output
    p.stdout?.on('data', checkDone);

    // Terminate with failure when error detector find a match, otherwise send to predicate function
    p.stderr?.on('data', (data: string) =>
      data.match(errorDetector) ? terminate(data, 'fail') : checkDone(data)
    );

    // Listen for error and exit events
    p.on('error', (err) => {
      logError('Received error event');
      terminate(err.message, 'fail');
    });
    p.on('exit', (code) => {
      if (!complete) {
        logError(
          'Command output:',
          output
            .split('\n')
            .map((l) => `    ${l}`)
            .join('\n')
        );
        reject(`Exited with ${code}`);
      } else {
        terminate(output, 'success');
      }
    });
  });
}
