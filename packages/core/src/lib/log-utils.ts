import chalk from 'chalk';

const envVariable = 'NX_PLUGINS_LOG_PREFIX';
const defaultPrefix = 'E2E';

/**
 * Log a colored debug message to the console.
 *
 * Log prefix can be customized by setting the `NX_PLUGINS_LOG_PREFIX` environment variable.
 * Default log prefix is `E2E`.
 *
 * @param title Log message title
 * @param body Log message body
 */
export function logDebug(title: string, body?: string): void {
  const message = `${chalk.reset.inverse.bold.cyan(
    ' DEBUG '
  )} ${chalk.bold.cyan(title)}`;
  return consoleLogger(message, body);
}

/**
 * Log a colored info message to the console.
 *
 * Log prefix can be customized by setting the `NX_PLUGINS_LOG_PREFIX` environment variable.
 * Default log prefix is `E2E`.
 *
 * @param title Log message title
 * @param body Log message body
 */
export function logInfo(title: string, body?: string): void {
  const message = `${chalk.reset.inverse.bold.white(
    ' INFO '
  )} ${chalk.bold.white(title)}`;
  return consoleLogger(message, body);
}

/**
 * Log a colored error message to the console.
 *
 * Log prefix can be customized by setting the `NX_PLUGINS_LOG_PREFIX` environment variable.
 * Default log prefix is `E2E`.
 *
 * @param title Log message title
 * @param body Log message body
 */
export function logError(title: string, body?: string): void {
  const message = `${chalk.reset.inverse.bold.red(' ERROR ')} ${chalk.bold.red(
    title
  )}`;
  return consoleLogger(message, body);
}

/**
 * Log a colored success message to the console.
 *
 * Log prefix can be customized by setting the `NX_PLUGINS_LOG_PREFIX` environment variable.
 * Default log prefix is `E2E`.
 *
 * @param title Log message title
 * @param body Log message body
 */
export function logSuccess(title: string, body?: string): void {
  const message = `${chalk.reset.inverse.bold.green(
    ' SUCCESS '
  )} ${chalk.bold.green(title)}`;
  return consoleLogger(message, body);
}

/** @private */
function consoleLogger(message: string, body?: string): void {
  process.stdout.write('\n');
  process.stdout.write(`${getLogPrefix()} ${message}\n`);
  if (body) {
    process.stdout.write(`${body}\n`);
  }
  process.stdout.write('\n');
}

/** @private */
function getLogPrefix(): string {
  const prefix = process.env[envVariable] ?? defaultPrefix;
  return `${chalk.reset.inverse.bold.keyword('orange')(` ${prefix.trim()} `)}`;
}
