import { basename } from 'path';

import * as chalk from 'chalk';
import {
  type CreateWorkspaceOptions,
  createWorkspace
} from 'create-nx-workspace';
import {
  determineCI,
  determineDefaultBase,
  determineNxCloud,
  determinePackageManager
} from 'create-nx-workspace/src/internal-utils/prompts';
import {
  withAllPrompts,
  withCI,
  withGitOptions,
  withNxCloud,
  withOptions,
  withPackageManager
} from 'create-nx-workspace/src/internal-utils/yargs-options';
import { printNxCloudSuccessMessage } from 'create-nx-workspace/src/utils/nx/nx-cloud';
import { output } from 'create-nx-workspace/src/utils/output';
import * as enquirer from 'enquirer';
import * as yargs from 'yargs';

export interface Arguments extends CreateWorkspaceOptions {
  /** Payload app name required by `nx-payload:preset` */
  payloadAppName: string;

  /** Payload app path required by `nx-payload:preset` */
  payloadAppDirectory: string;

  /** Plugin version to install */
  pluginVersion?: string;
}

/** Name of published package with the `preset` generator */
const pluginName = '@cdwr/nx-payload';

/**
 * CLI command arguments
 */
export const commandsObject: yargs.Argv<Arguments> = yargs
  .wrap(yargs.terminalWidth())
  .parserConfiguration({
    'strip-dashed': true,
    'dot-notation': true
  })
  .command<Arguments>(
    // this is the default and only command
    '$0 [name] [options]',
    'Create a new Nx workspace',

    // Builder
    (yargs) =>
      withOptions(
        yargs
          .option('name', {
            describe: chalk.dim`Workspace name (e.g. org name)`,
            type: 'string'
          })
          .option('payloadAppName', {
            describe: chalk.dim`The name of the Payload admin application`,
            type: 'string'
          })
          .option('payloadAppDirectory', {
            describe: chalk.dim`The path to where the application is installed (Default: 'apps/<appName>')`,
            type: 'string'
          })
          .option('interactive', {
            describe: chalk.dim`Enable interactive mode with presets`,
            type: 'boolean',
            default: true
          })
          .option('pluginVersion', {
            describe: chalk.dim`Version of the ${pluginName} package to be used. Latest by default.`,
            type: 'string'
          })
          .middleware(
            (args) =>
              normalizeArgsMiddleware(args as yargs.Arguments<Arguments>),
            false
          ),
        withNxCloud,
        withCI,
        withAllPrompts,
        withPackageManager,
        withGitOptions
      ),

    // Handler
    async (argv: yargs.ArgumentsCamelCase<Arguments>) => {
      await main(argv).catch((error) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { version } = require('../package.json');
        output.error({
          title: `Something went wrong! v${version}`
        });
        throw error;
      });
    }
  )
  .help('help', chalk.dim`Show help`)
  .version(
    'version',
    chalk.dim`Show version`,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('../package.json').version
  ) as yargs.Argv<Arguments>;

/**
 * Main function
 *
 * @param parsedArgs Parsed command arguments
 */
async function main(parsedArgs: yargs.Arguments<Arguments>): Promise<void> {
  output.log({
    title: `Creating your workspace.`,
    bodyLines: [
      'To make sure the command works reliably in all environments, and that the preset is applied correctly,',
      `Nx will run "${parsedArgs.packageManager} install" several times. Please wait.`
    ]
  });

  let presetName = pluginName;
  if (parsedArgs?.pluginVersion) {
    presetName += `@${parsedArgs.pluginVersion}`;
  }

  const workspaceInfo = await createWorkspace<Arguments>(
    presetName,
    parsedArgs
  );

  if (parsedArgs.nxCloud && workspaceInfo.nxCloudInfo) {
    printNxCloudSuccessMessage(workspaceInfo.nxCloudInfo);
  }

  output.log({
    title: `Successfully initialized the ${pluginName} workspace`
  });
}

/**
 * `yargs` middleware to normalize command arguments
 *
 * @param argv Command arguments
 */
const normalizeArgsMiddleware: yargs.MiddlewareFunction<Arguments> = async (
  argv: yargs.Arguments<Arguments>
): Promise<void> => {
  try {
    output.log({
      title:
        "Let's create a new workspace [https://nx.dev/getting-started/intro]"
    });

    const preset = pluginName;
    const name = await resolveWorkspaceName(argv);
    const payloadAppName = await resolveAppName(argv);
    const payloadAppDirectory = await resolveDirectory(argv, payloadAppName);

    const packageManager = await determinePackageManager(argv);
    const defaultBase = await determineDefaultBase(argv);
    const nxCloud = await determineNxCloud(argv);
    const ci = await determineCI(argv, nxCloud);

    Object.assign(argv, {
      name,
      payloadAppName,
      payloadAppDirectory,
      preset,
      nxCloud,
      packageManager,
      defaultBase,
      ci
    });
  } catch (e) {
    process.exit(1);
  }
};

/**
 * Resolve workspace name
 *
 * 1. First argument
 * 2. `--name` argument
 *
 * Fallback: suggest project name
 *
 * @param parsedArgs Parsed command arguments
 * @returns Workspace name
 */
async function resolveWorkspaceName(
  parsedArgs: yargs.Arguments<Arguments>
): Promise<string> {
  // First argument or by `name`
  const name: string = parsedArgs._[0]
    ? parsedArgs._[0].toString()
    : parsedArgs.name;

  if (name) {
    return Promise.resolve(name);
  }

  const initial = basename(parsedArgs['$0']);

  const a = await enquirer.prompt<{ Name: string }>([
    {
      name: 'Name',
      message: `Workspace name                      `,
      type: 'input',
      initial
    }
  ]);
  if (!a.Name) {
    output.error({
      title: 'Invalid workspace name',
      bodyLines: [`Workspace name cannot be empty`]
    });
    process.exit(1);
  }
  return a.Name;
}

/**
 * Resolve application name
 *
 * Fallback: suggest `payload-admin`
 *
 * @param parsedArgs Parsed command arguments
 * @returns Application name
 */
async function resolveAppName(
  parsedArgs: yargs.Arguments<Arguments>
): Promise<string> {
  if (parsedArgs.payloadAppName) {
    return Promise.resolve(parsedArgs.payloadAppName);
  }

  return enquirer
    .prompt<{ PayloadAppName: string }>([
      {
        name: 'PayloadAppName',
        message: `Application name                    `,
        type: 'input',
        initial: 'payload-admin'
      }
    ])
    .then((a) => {
      if (!a.PayloadAppName) {
        output.error({
          title: 'Invalid name',
          bodyLines: [`Name cannot be empty`]
        });
        process.exit(1);
      }
      return a.PayloadAppName;
    });
}

/**
 * Resolve application path
 *
 * Fallback: suggest `apps/{appName}`
 *
 * @param parsedArgs Parsed command arguments
 * @param appName Selected app name
 * @returns Application path
 */
async function resolveDirectory(
  parsedArgs: yargs.Arguments<Arguments>,
  appName: string
): Promise<string> {
  if (parsedArgs.payloadAppDirectory) {
    return Promise.resolve(parsedArgs.payloadAppDirectory);
  }

  return enquirer
    .prompt<{ PayloadAppDirectory: string }>([
      {
        name: 'PayloadAppDirectory',
        message: `Application path                     `,
        type: 'input',
        initial: `apps/${appName}`
      }
    ])
    .then((a) => {
      if (!a.PayloadAppDirectory) {
        output.error({
          title: 'Invalid path',
          bodyLines: [`Application path cannot be empty`]
        });
        process.exit(1);
      }
      return a.PayloadAppDirectory;
    });
}
