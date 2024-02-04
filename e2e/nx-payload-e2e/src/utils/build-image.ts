import Docker from 'dockerode';
import { pack } from 'tar-fs';

type ErrorDetail = { code: number; message: string };

/**
 * Stream data returned by `docker.modem.followProgress`
 * in combination with `buildImage` action
 */
type BuildStream = Partial<{
  id: string;
  error: string;
  errorDetail: ErrorDetail;
  status: string;
  progress: string;
  progressDetail: { current: number; total: number };
  stream: string;
}>;

type Options = {
  /** Context path */
  context: string;
  /** Docker file path relative to context */
  dockerfile: string;
  /** Build arguments */
  buildargs?: Record<string, string>;
  /** Image tag */
  tag?: string;
};

/**
 * Build a Docker image
 *
 * @param options Build options
 * @returns error object or `null` when successful
 */
export const buildImage = async (options: Options) => {
  const docker = new Docker();
  const { context, dockerfile, buildargs, tag: t } = options;

  const stream = await docker.buildImage(pack(context), {
    dockerfile,
    buildargs,
    t
  });

  return new Promise<Error | ErrorDetail | null>((resolve) => {
    docker.modem.followProgress(
      stream,
      (err) => {
        if (err) {
          console.log('Build failed (error)');
          return resolve(err);
        }
        resolve(null);
      },
      (event: BuildStream) => {
        if ('stream' in event && event.stream?.includes('ERR!')) {
          console.log(event.stream);
        } else if (event?.errorDetail) {
          console.error('Build failed (event): ', event.error);
          resolve(event.errorDetail);
        }
      }
    );
  });
};
