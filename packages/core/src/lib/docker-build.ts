import assert from 'assert';
import { existsSync } from 'fs';
import { join } from 'path';

import { dockerCommand } from 'docker-cli-js';
import log from 'npmlog';

/**
 * Image build configuration
 */
type ImageConfig = {
  /** Context path */
  context: string;

  /** Dockerfile path relative to `context` */
  dockerfile: string;

  /** Image name */
  name: string;

  /**
   * Image tag
   * @default 'latest'
   */
  tag?: string;

  /**
   * Build arguments
   * @default {}
   */
  args?: Record<string, string>;
};

/**
 * Docker build response data
 */
type BuildData = {
  command: string;
  raw: string;
  response: Array<ImageConfig>;
};

/** npmlog prefix */
export const LOG_PREFIX = 'build';

/**
 * Build image using local Docker installation
 *
 * @param image Image build configuration
 * @param quiet Suppress all output
 *
 * @throws When configuration details missing
 * @throws When Dockerfile isn't found
 * @throws When image fails to build
 */
export const dockerBuild = async (image: ImageConfig, quiet?: boolean) => {
  const { context, dockerfile, name, tag, args } = image;
  const dockerfilePath = join(context, dockerfile);

  assert(!!context?.length, 'Context path must be provided');
  assert(!!dockerfile?.length, 'Doockerfile path must be provided');
  assert(!!name?.length, 'Image name must be provided');

  if (!existsSync(join(dockerfilePath))) {
    assert(`Dockerfile not found: ${dockerfilePath}`);
  }

  const buildTag = `${name}:${tag}`;

  if (!quiet) {
    log.info(LOG_PREFIX, `[${buildTag}] Context: '${image.context}'`);
    log.info(LOG_PREFIX, `[${buildTag}] Dockerfile: '${image.dockerfile}'`);
    log.info(
      LOG_PREFIX,
      `[${buildTag}] Args: ${image?.args ? JSON.stringify(image.args) : '{}'}`
    );
  }

  const buildArgs =
    (args &&
      Object.keys(args)
        .map((key) => `--build-arg ${key}=${args[key]}`)
        .join(' ')) ||
    '';

  const cmd = `build -f ${dockerfilePath} -t ${buildTag} ${buildArgs} ${quiet ? '-q' : ''} ${context}`;

  !quiet && log.info(LOG_PREFIX, `[${buildTag}] Building image...`);

  // Throws native error logs when build fails
  try {
    const data: BuildData = await dockerCommand(cmd, { echo: !quiet });
    !quiet &&
      log.info(LOG_PREFIX, `[${buildTag}] Build success: ${data.response[0]}`);
  } catch (error) {
    log.error(LOG_PREFIX, `[${buildTag}] Build failed`);
    log.error(LOG_PREFIX, `[${buildTag}] Command: '${cmd}'`);
    throw error;
  }
};
